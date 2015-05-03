'use strict';

var enumServicesSocket 	= require('../utilities/enums/servicessocketevent');

module.exports = Service;

/*jshint latedef: false */
function Service(id, gamblerSocket, traderSocket, nsp){
	this.id 				= id;
	this.roomName			= 'room-' + id;
	this.gamblerSocket 		= gamblerSocket;
	this.traderSocket 		= traderSocket;
	this.nsp 				= nsp;
	this.order 				= this.order ? ++this.order : 0;

	// Joing gambler and trader to service room.
	this.fnJoinToServiceRoom();

	// Notify to trader of the new requested service
	this.fnNotifyNewServiceToTrader();

	// Notify to glamber that trader has been assigne
	this.fnNotifyServiceCreatedToGambler();
}


// Notify to service room that service was abandoned by gambler
Service.prototype.fnAbandonedByGambler = function(){
	this.fnSendEventToServiceRoom(enumServicesSocket.app.ABANDONED_BY_GAMBLER, {
		serviceId: 	this.id,
		info: 		'Gmabler has abandoned the service.'
	});
	// Gambler and trader must leave service room.
	this.fnLeaveServiceRoom();
};

// Notify to service room that service was abandoned by trader
Service.prototype.fnAbandonedByTrader = function(){
	this.fnSendEventToServiceRoom(enumServicesSocket.app.ABANDONED_BY_TRADER, {
		serviceId: 	this.id,
		info: 		'Sorry, our trader is experimenting technical problems. Service has been abandoned.'
	});
	// Gambler and trader must leave service room.
	this.fnLeaveServiceRoom();
};

// Trader decides to complete the service. Gambler and trader must leave service room. Notify to service room.
Service.prototype.fnComplete = function(){
	// Notify to service room that service has beed completed		
	this.fnSendEventToServiceRoom(enumServicesSocket.app.SERVICE_COMPLETED, {
		serviceId: 	this.id
	});

	// Gambler and trader must leave service room.
	this.fnLeaveServiceRoom();
};

// Trader decides to desist the service. Gambler and trader must leave service room. Notify to service room.
Service.prototype.fnDesist = function(){
	// Notify to service room that service has been desisted		
	this.fnSendEventToServiceRoom(enumServicesSocket.app.SERVICE_DESISTED, {
		serviceId: 	this.id
	});

	// Gambler and trader must leave service room.
	this.fnLeaveServiceRoom();
};

// Join gambler or trader to service room.
Service.prototype.fnJoinToServiceRoom = function(){
	this.gamblerSocket.join(this.roomName);
	this.traderSocket.join(this.roomName);
};

// Gambler and trader leaves the service room.
Service.prototype.fnLeaveServiceRoom = function(){
	this.gamblerSocket.leave(this.roomName);
	this.traderSocket.leave(this.roomName);
};

/** 
 * Send chat message to service room.
 *
 * @param {String} message
 */
Service.prototype.fnNewMessage = function(socket, message){
	this.fnSendEventToServiceRoom(enumServicesSocket.app.NEW_MESSAGE_SERVICE, {
		serviceId: 	this.id,
		username: 	socket.username,
		role: 		socket.request.user.role,
		message:  	message
	});
};

/** 
 * Notify to trader of the new requested service
 *
 * @param {String} message
 */
Service.prototype.fnNotifyNewServiceToTrader = function(){
	this.traderSocket.emit(enumServicesSocket.app.NEW_SERVICE,{
		serviceId: this.id
	});
};

/** 
 * Notify to glamber that trader has been created
 *
 * @param {String} message
 */
Service.prototype.fnNotifyServiceCreatedToGambler = function(){
	this.gamblerSocket.emit(enumServicesSocket.app.SERVICE_CREATED,{
		serviceId: this.id
	});
};

// Send event to service room
Service.prototype.fnSendEventToServiceRoom = function(event, object){
	this.nsp.to(this.roomName).emit(event, object);	
};