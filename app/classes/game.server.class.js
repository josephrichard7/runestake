'use strict';

var enumGamesSocket 	= require('../utilities/enums/servicessocketevent'),
	socketGame 		= require('../services/socket');

module.exports = Game;

/*jshint latedef: false */
function Game(id, leftGamblerSocket, rightGamblerSocket, nsp){
	this.id 				= id;
	this.roomName			= 'room-' + id;
	this.leftGamblerSocket 	= leftGamblerSocket;
	this.rightGamblerSocket = rightGamblerSocket;
	this.nsp 				= nsp;
	this.order 				= this.order ? ++this.order : 0;

	// Joing gambler and trader to service room.
	this.fnJoinToGameRoom();

	// Notify to trader of the new requested service
	this.fnNotifyNewGameToTrader();

	// Notify to glamber that trader has been assigne
	this.fnNotifyGameCreatedToGambler();
}


// Notify to service room that service was abandoned by gambler
Game.prototype.fnAbandonedByGambler = function(){
	this.fnSendEventToGameRoom(enumGamesSocket.app.ABANDONED_BY_GAMBLER, {
		serviceId: 	this.id,
		info: 		'Gambler has abandoned the service.'
	});
	// Gambler and trader must leave service room.
	this.fnLeaveGameRoom();
};

// Notify to service room that service was abandoned by trader
Game.prototype.fnAbandonedByTrader = function(){
	this.fnSendEventToGameRoom(enumGamesSocket.app.ABANDONED_BY_TRADER, {
		serviceId: 	this.id,
		info: 		'Sorry, our trader is experimenting technical problems. Game has been abandoned.'
	});
	// Gambler and trader must leave service room.
	this.fnLeaveGameRoom();
};

// Trader decides to complete the service. Gambler and trader must leave service room. Notify to service room.
Game.prototype.fnComplete = function(){
	// Notify to service room that service has beed completed		
	this.fnSendEventToGameRoom(enumGamesSocket.app.SERVICE_COMPLETED, {
		serviceId: 	this.id
	});

	// Gambler and trader must leave service room.
	this.fnLeaveGameRoom();
};

// Trader decides to desist the service. Gambler and trader must leave service room. Notify to service room.
Game.prototype.fnDesist = function(){
	// Notify to service room that service has been desisted		
	this.fnSendEventToGameRoom(enumGamesSocket.app.SERVICE_DESISTED, {
		serviceId: 	this.id
	});

	// Gambler and trader must leave service room.
	this.fnLeaveGameRoom();
};

// Join gambler or trader to service room.
Game.prototype.fnJoinToGameRoom = function(){
	this.leftGamblerSocket.join(this.roomName);
	this.rightGamblerSocket.join(this.roomName);
};

// Gambler and trader leaves the service room.
Game.prototype.fnLeaveGameRoom = function(){
	this.leftGamblerSocket.leave(this.roomName);
	this.rightGamblerSocket.leave(this.roomName);
};

/** 
 * Send chat message to service room.
 *
 * @param {String} message
 */
Game.prototype.fnNewMessage = function(socket, message){
	if(message){		
		this.fnSendEventToGameRoom(enumGamesSocket.app.NEW_MESSAGE_SERVICE, {
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
Game.prototype.fnNotifyNewGameToTrader = function(){
	socketGame.fnEmitToMe(this.rightGamblerSocket, enumGamesSocket.app.NEW_SERVICE, {
		serviceId: this.id
	});
};

/** 
 * Notify to glamber that trader has been created
 *
 * @param {String} message
 */
Game.prototype.fnNotifyGameCreatedToGambler = function(){
	socketGame.fnEmitToMe(this.leftGamblerSocket, enumGamesSocket.app.SERVICE_CREATED, {
		serviceId: this.id
	});
};

// Send default messages to service room
Game.prototype.fnSendDefaultMessageToGameRoom = function(){
	this.fnNewMessage(this.rightGamblerSocket, this.rightGamblerSocket.request.user.defaultMessageForGame);
	this.fnNewMessage(this.leftGamblerSocket, this.leftGamblerSocket.request.user.defaultMessageForGame);
};

// Send event to service room
Game.prototype.fnSendEventToGameRoom = function(event, object){
	socketGame.fnEmitToRoom(this.nsp, this.roomName, event, object);
};