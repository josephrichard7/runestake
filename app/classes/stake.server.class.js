'use strict';

var enumStakesSocket 	= require('../utilities/enums/stakesocketevent'),
	socketStake 		= require('../services/sockets/socket');

module.exports = Stake;

/*jshint latedef: false */
function Stake(id, leftGamblerSocket, rightGamblerSocket, nsp){
	this.id 				= id;
	this.roomName			= 'room-' + id;
	this.leftGamblerSocket 	= leftGamblerSocket;
	this.rightGamblerSocket = rightGamblerSocket;
	this.nsp 				= nsp;
	this.order 				= this.order ? ++this.order : 0;

	// Joing gambler and trader to service room.
	this.fnJoinToStakeRoom();

	// Notify to trader of the new requested service
	this.fnNotifyNewStakeToTrader();

	// Notify to glamber that trader has been assigne
	this.fnNotifyStakeCreatedToGambler();
}


// Notify to service room that service was abandoned by gambler
Stake.prototype.fnAbandonedByGambler = function(){
	this.fnSendEventToStakeRoom(enumStakesSocket.app.ABANDONED_BY_GAMBLER, {
		serviceId: 	this.id,
		info: 		'Gambler has abandoned the service.'
	});
	// Gambler and trader must leave service room.
	this.fnLeaveStakeRoom();
};

// Notify to service room that service was abandoned by trader
Stake.prototype.fnAbandonedByTrader = function(){
	this.fnSendEventToStakeRoom(enumStakesSocket.app.ABANDONED_BY_TRADER, {
		serviceId: 	this.id,
		info: 		'Sorry, our trader is experimenting technical problems. Stake has been abandoned.'
	});
	// Gambler and trader must leave service room.
	this.fnLeaveStakeRoom();
};

// Trader decides to complete the service. Gambler and trader must leave service room. Notify to service room.
Stake.prototype.fnComplete = function(){
	// Notify to service room that service has beed completed		
	this.fnSendEventToStakeRoom(enumStakesSocket.app.SERVICE_COMPLETED, {
		serviceId: 	this.id
	});

	// Gambler and trader must leave service room.
	this.fnLeaveStakeRoom();
};

// Trader decides to desist the service. Gambler and trader must leave service room. Notify to service room.
Stake.prototype.fnDesist = function(){
	// Notify to service room that service has been desisted		
	this.fnSendEventToStakeRoom(enumStakesSocket.app.SERVICE_DESISTED, {
		serviceId: 	this.id
	});

	// Gambler and trader must leave service room.
	this.fnLeaveStakeRoom();
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

/** 
 * Send chat message to service room.
 *
 * @param {String} message
 */
Stake.prototype.fnNewMessage = function(socket, message){
	if(message){		
		this.fnSendEventToStakeRoom(enumStakesSocket.app.NEW_MESSAGE_SERVICE, {
			serviceId: 	this.id,
			username: 	socket.username,
			role: 		socket.request.user.role,
			message:  	message
		});	
	}
};

/** 
 * Notify to trader of the new requested service
 *
 * @param {String} message
 */
Stake.prototype.fnNotifyNewStakeToTrader = function(){
	socketStake.fnEmitToMe(this.rightGamblerSocket, enumStakesSocket.app.NEW_SERVICE, {
		serviceId: this.id
	});
};

/** 
 * Notify to glamber that trader has been created
 *
 * @param {String} message
 */
Stake.prototype.fnNotifyStakeCreatedToGambler = function(){
	socketStake.fnEmitToMe(this.leftGamblerSocket, enumStakesSocket.app.SERVICE_CREATED, {
		serviceId: this.id
	});
};

// Send default messages to service room
Stake.prototype.fnSendDefaultMessageToStakeRoom = function(){
	this.fnNewMessage(this.rightGamblerSocket, this.rightGamblerSocket.request.user.defaultMessageForStake);
	this.fnNewMessage(this.leftGamblerSocket, this.leftGamblerSocket.request.user.defaultMessageForStake);
};

// Send event to service room
Stake.prototype.fnSendEventToStakeRoom = function(event, object){
	socketStake.fnEmitToRoom(this.nsp, this.roomName, event, object);
};