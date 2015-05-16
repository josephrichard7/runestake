'use strict';

var enumServicesSocket 	= require('../utilities/enums/servicessocketevent');

module.exports = BankService;

/*jshint latedef: false */
function BankService(id, traderSocket, bankSocket, nsp){
	this.id 				= id;
	this.roomName			= 'room-' + id;
	this.traderSocket 		= traderSocket;
	this.bankSocket 		= bankSocket;
	this.nsp 				= nsp;
	this.order 				= this.order ? ++this.order : 0;

	// Joing trader and bank to service room.
	this.fnJoinToServiceRoom();

	// Notify to bank of the new requested service
	this.fnNotifyNewServiceToBank();

	// Notify to glamber that bank has been assigne
	this.fnNotifyServiceCreatedToTrader();
}


// Notify to service room that service was abandoned by trader
BankService.prototype.fnAbandonedByTrader = function(){
	this.fnSendEventToServiceRoom(enumServicesSocket.app.ABANDONED_BY_TRADER, {
		serviceId: 	this.id,
		info: 		'Trader has abandoned the service.'
	});
	// Trader and bank must leave service room.
	this.fnLeaveServiceRoom();
};

// Notify to service room that service was abandoned by bank
BankService.prototype.fnAbandonedByBank = function(){
	this.fnSendEventToServiceRoom(enumServicesSocket.app.ABANDONED_BY_BANK, {
		serviceId: 	this.id,
		info: 		'Sorry, our bank is experimenting technical problems. Service has been abandoned.'
	});
	// Trader and bank must leave service room.
	this.fnLeaveServiceRoom();
};

// Bank decides to complete the service. Trader and bank must leave service room. Notify to service room.
BankService.prototype.fnComplete = function(){
	// Notify to service room that service has beed completed		
	this.fnSendEventToServiceRoom(enumServicesSocket.app.SERVICE_COMPLETED, {
		serviceId: 	this.id
	});

	// Trader and bank must leave service room.
	this.fnLeaveServiceRoom();
};

// Bank decides to desist the service. Trader and bank must leave service room. Notify to service room.
BankService.prototype.fnDesist = function(){
	// Notify to service room that service has been desisted		
	this.fnSendEventToServiceRoom(enumServicesSocket.app.SERVICE_DESISTED, {
		serviceId: 	this.id
	});

	// Trader and bank must leave service room.
	this.fnLeaveServiceRoom();
};

// Join trader or bank to service room.
BankService.prototype.fnJoinToServiceRoom = function(){
	this.traderSocket.join(this.roomName);
	this.bankSocket.join(this.roomName);
};

// Trader and bank leaves the service room.
BankService.prototype.fnLeaveServiceRoom = function(){
	this.traderSocket.leave(this.roomName);
	this.bankSocket.leave(this.roomName);
};

/** 
 * Send chat message to service room.
 *
 * @param {String} message
 */
BankService.prototype.fnNewMessage = function(socket, message){
	if(message){		
		this.fnSendEventToServiceRoom(enumServicesSocket.app.NEW_MESSAGE_SERVICE, {
			serviceId: 	this.id,
			username: 	socket.username,
			role: 		socket.request.user.role,
			message:  	message
		});	
	}
};

/** 
 * Notify to bank of the new requested service
 *
 * @param {String} message
 */
BankService.prototype.fnNotifyNewServiceToBank = function(){
	this.bankSocket.emit(enumServicesSocket.app.NEW_SERVICE,{
		serviceId: this.id
	});
};

/** 
 * Notify to glamber that bank has been created
 *
 * @param {String} message
 */
BankService.prototype.fnNotifyServiceCreatedToTrader = function(){
	this.traderSocket.emit(enumServicesSocket.app.SERVICE_CREATED,{
		serviceId: this.id
	});
};

// Send default messages to service room
BankService.prototype.fnSendDefaultMessageToServiceRoom = function(){
	this.fnNewMessage(this.bankSocket, this.bankSocket.request.user.defaultMessageForService);
	// this.fnNewMessage(this.traderSocket, this.traderSocket.request.user.defaultMessageForService);
};

// Send event to service room
BankService.prototype.fnSendEventToServiceRoom = function(event, object){
	this.nsp.to(this.roomName).emit(event, object);	
};