'use strict';

var enumStakeSocket 	= require('../utilities/enums/stakesocketevent'),
	StakeHit			= require('../classes/stakehit'),
	socketService 		= require('../services/sockets/socket');

module.exports = Stake;

/*jshint latedef: false */
function Stake(id, leftGamblerSocket, rightGamblerSocket, nsp){
	this.id 					= id;
	this.roomName				= 'room-' + id;
	this.leftGamblerSocket 		= leftGamblerSocket;
	this.rightGamblerSocket 	= rightGamblerSocket;
	this.nsp 					= nsp;
	this.listHit 				= [];
	this.rightGamblerHealth 	= 99;
	this.leftGamblerHealth 		= 99;
	this.leftGamblerReady		= false;
	this.rightGamblerReady		= false;
	this.stakeStarted 			= false;
	this.winnerGambler  		= undefined;

	// Constants
	this.TIME_INTERVAL 			= 2400;

	// Join gamblers to stake room.
	this.fnJoinToStakeRoom();

	// Notify to stake room that stake has been create
	this.fnNotifyStakeCreated();
}

Stake.prototype.fnFinishStake = function(){
	var self = this;

	setTimeout(function(){
		self.fnSendEventToStakeRoom(enumStakeSocket.app.STAKE_FINISHED, {
			stakeId: 		self.id
		});
	}, self.TIME_INTERVAL * (self.listHit.length + 1));
};

Stake.prototype.fnGenerateStake = function(){
	var hit;
	var oldHealthRightGambler;
	var oldHealthLeftGambler;
	var amountHitReceivedRightGambler;
	var amountHitReceivedLeftGambler;

	while(this.rightGamblerHealth > 0 && this.leftGamblerHealth > 0){
		hit = new StakeHit();

		oldHealthRightGambler 			= this.rightGamblerHealth;
		oldHealthLeftGambler			= this.leftGamblerHealth;
		amountHitReceivedRightGambler	= hit.amountHitReceivedRightGambler;
		amountHitReceivedLeftGambler	= hit.amountHitReceivedLeftGambler;

		this.rightGamblerHealth -= hit.amountHitReceivedRightGambler;
		this.rightGamblerHealth	= this.rightGamblerHealth < 0 ? 0 : this.rightGamblerHealth;
		this.leftGamblerHealth 	-= hit.amountHitReceivedLeftGambler;
		this.leftGamblerHealth 	= this.leftGamblerHealth < 0 ? 0 : this.leftGamblerHealth;

		if(this.leftGamblerHealth === 0 && this.rightGamblerHealth === 0){
			if(hit.leftGamblerHitFirst){
				this.leftGamblerHealth 			= oldHealthLeftGambler;
				// this.winnerGambler 				= this.leftGamblerSocket.username;
				amountHitReceivedRightGambler 	= -1;
			}else{
				this.rightGamblerHealth 		= oldHealthRightGambler;
				// this.winnerGambler 				= this.rightGamblerSocket.username;
				amountHitReceivedLeftGambler	= -1;
			}
		}

		this.listHit.push({
			leftGamblerHitFirst: 			hit.leftGamblerHitFirst,
			amountHitReceivedRightGambler:	amountHitReceivedRightGambler,
			amountHitReceivedLeftGambler:	amountHitReceivedLeftGambler,
			leftGamblerHealth: 				this.leftGamblerHealth,
			rightGamblerHealth: 			this.rightGamblerHealth
		});		
	}

	if(this.leftGamblerHealth === 0){
		this.winnerGambler = this.rightGamblerSocket.username;
	}else{
		this.winnerGambler = this.leftGamblerSocket.username;
	}
};

// Join gambler or trader to service room.
Stake.prototype.fnJoinToStakeRoom = function(){
	this.leftGamblerSocket.join(this.roomName);
	this.rightGamblerSocket.join(this.roomName);
};

// Gambler and trader leaves the service room.
Stake.prototype.fnLeaveStakeRoom = function(){
	this.leftGamblerSocket.leave(this.roomName);
	this.rightGamblerSocket.leave(this.roomName);
};

Stake.prototype.fnLeftGamblerReady = function(){
	this.leftGamblerReady = true;
	if(this.rightGamblerReady){
		this.fnStartStake();
	}
};

/** 
 * Send chat message to service room.
 *
 * @param {String} message
 */
Stake.prototype.fnNewMessage = function(socket, message){
	if(message){		
		this.fnSendEventToStakeRoom(enumStakeSocket.app.NEW_CHAT_MESSAGE, {
			serviceId: 	this.id,
			username: 	socket.username,
			role: 		socket.request.user.role,
			message:  	message
		});	
	}
};

/** 
 * Notify to gambler that Stake has been created
 *
 * @param {String} message
 */
Stake.prototype.fnNotifyStakeCreated = function(){
	this.fnSendEventToStakeRoom(enumStakeSocket.app.STAKE_CREATED, {
		stakeId: this.id
	});
};

Stake.prototype.fnRightGamblerReady = function(){
	this.rightGamblerReady = true;
	if(this.leftGamblerReady){
		this.fnStartStake();
	}
};

// Send event to service room
Stake.prototype.fnSendEventToStakeRoom = function(event, object){
	socketService.fnEmitToRoom(this.nsp, this.roomName, event, object);
};

/** 
 * 
 *
 * @param
 */
Stake.prototype.fnStartStake = function(){
	var self = this;

	if(this.stakeStarted){
		return;
	}
	this.stakeStarted = true;

	this.listHit.forEach(function(stakeHit, index){
		setTimeout(function(){
			self.fnSendEventToStakeRoom(enumStakeSocket.app.GAMBLER_HIT, {
				stakeHit: stakeHit
			});
		}, self.TIME_INTERVAL * (index + 1));
	});

	this.fnFinishStake();
};