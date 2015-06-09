'use strict';

var enumStakeSocket 	= require('../utilities/enums/stakesocketevent'),
	socketStake 		= require('../services/sockets/socket');

module.exports = Stake;

/*jshint latedef: false */
function Stake(id, leftGamblerSocket, rightGamblerSocket, nsp){
	this.id 				= id;
	this.roomName			= 'room-' + id;
	this.leftGamblerSocket 	= leftGamblerSocket;
	this.rightGamblerSocket = rightGamblerSocket;
	this.nsp 				= nsp;

	// Join gamblers to stake room.
	this.fnJoinToStakeRoom();

	// Notify to stake room that stake has been create
	this.fnNotifyStakeCreated();
}

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

// Send event to service room
Stake.prototype.fnSendEventToStakeRoom = function(event, object){
	socketStake.fnEmitToRoom(this.nsp, this.roomName, event, object);
};