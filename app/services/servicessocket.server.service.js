'use strict';

var enumUserrole		= require('../utilities/enums/userrole'),
	enumServicesSocket 	= require('../utilities/enums/servicessocketevent'),
	serviceService 		= require('../services/service'),
	Service 			= require('../classes/service');

module.exports = ServicesSocketService;

/*jshint latedef: false */
function ServicesSocketService(nsp){
	this.nsp 					= nsp;
	this.listConnectedTraders 	= {};
	this.listConnectedGamblers 	= {};
	this.listServices			= {};
	this.queueTraders 			= [];
	this.numberServices			= 0;

	// Constants
	this.TRADER_ROOM 			= 'TRADER_ROOM';
}

/** 
 * Add a gambler to the list of connected gamblers.
 *
 */
ServicesSocketService.prototype.fnAddConnectedGambler = function(socket){
	this.listConnectedGamblers[socket.username] = {
		user: 		socket.request.user,
		socket: 	socket,
		service: 	{}
	};
};

/** 
 * Add a trader to the list of connected traders.
 *
 */
ServicesSocketService.prototype.fnAddConnectedTrader = function(socket){
	this.listConnectedTraders[socket.username] = {
		user: 			socket.request.user,
		socket: 		socket,
		listServices: 	{}
	};
};

/** 
 * Add a service created by the gambler.
 *
 */
ServicesSocketService.prototype.fnAddService = function(id, gamblerSocket, traderSocket){
	var service = new Service(
		id,
		gamblerSocket,
		traderSocket,
		this.nsp
	);
	
	this.listServices[id] = service;
	this.numberServices++;
	
	return service;
};
	
/** 
 * Connects a new gambler or trader.
 *
 */
ServicesSocketService.prototype.fnConnectUser = function(socket){
	socket.username = socket.request.user.username;

	if(socket.request.user.role === enumUserrole.TRADER){
		// Connect new trader to be ready to accept service requests
		this.fnConnectTrader(socket);
	}else if(socket.request.user.role === enumUserrole.GAMBLER){
		// Connect new gambler to a service room
		this.fnConnectGambler(socket);
	}

	socket.emit(enumServicesSocket.app.CONNECTED_USER);
};

/** 
 * Connects a new gambler.
 *
 */
ServicesSocketService.prototype.fnConnectGambler = function(socket){
	var connectedGambler = this.fnGetConnectedGambler(socket.username);

	if(connectedGambler){
		connectedGambler.socket = socket;
	}else{
		this.fnAddConnectedGambler(socket);
	}

	// Event handlers
	socket.on(enumServicesSocket.app.TRADERS_AVAILABLE,		this.fnTradersAvailable(socket));
	socket.on(enumServicesSocket.app.CREATE_SERVICE, 		this.fnCreateService(socket));
	socket.on(enumServicesSocket.app.NEW_MESSAGE_SERVICE, 	this.fnNewMessage(socket));
	socket.on(enumServicesSocket.natives.DISCONNECT, 		this.fnDisconnection(socket));
};

/** 
 * Connects a new trader.
 *
 */
ServicesSocketService.prototype.fnConnectTrader = function(socket){
	var connectedTrader = this.fnGetConnectedTrader(socket.username);

	if(connectedTrader){
		connectedTrader.socket = socket;
	}else{
		this.fnAddConnectedTrader(socket);
	}

	// Event handlers
	socket.on(enumServicesSocket.app.START_WORK, 			this.fnTraderStartWork(socket));
	socket.on(enumServicesSocket.app.STOP_WORKING, 			this.fnTraderStopWorking(socket));
	socket.on(enumServicesSocket.app.NEW_MESSAGE_SERVICE, 	this.fnNewMessage(socket));
	socket.on(enumServicesSocket.app.SERVICE_FINISHED, 		this.fnServiceFinished(socket));
	socket.on(enumServicesSocket.natives.DISCONNECT, 		this.fnDisconnection(socket));
};

/** 
 * Delete connected gambler
 *
 * @param {String} gamblerUsername
 */
ServicesSocketService.prototype.fnDeleteConnectedGambler = function (gamblerUsername){
	delete this.listConnectedGamblers[gamblerUsername];
};

/** 
 * Delete connected trader
 *
 * @param {String} traderUsername
 */
ServicesSocketService.prototype.fnDeleteConnectedTrader = function (traderUsername){
	delete this.listConnectedTraders[traderUsername];
};

/** 
 * Delete service from list of services, from list services of the traders and from gambler
 *
 * @param {String} serviceId
 */
ServicesSocketService.prototype.fnDeleteService = function (serviceId){
	var service 			= this.fnGetService(serviceId);
	var connectedTrader 	= this.fnGetConnectedTrader(service.traderSocket.username);
	var connectedGambler 	= this.fnGetConnectedGambler(service.gamblerSocket.username);

	// Delete from list of services
	if(service && this.listServices[service.id]){
		delete this.listServices[service.id];
	}

	// Delete from list services of the trader
	if(connectedTrader && connectedTrader.listServices[service.id]){
		delete connectedTrader.listServices[service.id];		
	}

	// Delete from service of the gambler
	if(connectedGambler && connectedGambler.service && connectedGambler.service.id === service.id){
		delete connectedGambler.service;
	}
};

/** 
 * Delete a trader from queue
 *
 */
ServicesSocketService.prototype.fnDeleteTraderFromQueue = function(traderUsername){
	var index = this.queueTraders.indexOf(traderUsername);
	if(index >= 0){
		this.queueTraders.splice(index,1);
		this.fnDeleteTraderFromQueue(traderUsername);
	}
};

/** 
 * Called upon client disconnects. Disconnect gambler or trader from namespace.
 *
 */
ServicesSocketService.prototype.fnDisconnection = function(socket){
	var self = this;
	return function(){
		if(socket.request.user.role === enumUserrole.TRADER){
			self.fnDisconnectTrader(socket);
		}else if(socket.request.user.role === enumUserrole.GAMBLER){
			self.fnDisconnectGambler(socket);
		}		
	};
};

/** 
 * Disconnect gambler.
 *
 * @param socket
 */
ServicesSocketService.prototype.fnDisconnectGambler = function (socket){
	var connectedGambler = this.fnGetConnectedGambler(socket.username);

	if (connectedGambler) {
		// If Gambler is attending a service, notify that it has beed abandoned
		if(connectedGambler.service){
			serviceService.fnAbandonedByGambler(connectedGambler.service.id)
			.then(function(){
				connectedGambler.service.fnAbandonedByGambler();
			});
		}
		// Delete connected trader
		this.fnDeleteConnectedGambler(connectedGambler.user.username);
	}
};

/** 
 * Disconnect trader.
 *
 * @param socket
 */
ServicesSocketService.prototype.fnDisconnectTrader = function (socket){
	var self 			= this;
	var connectedTrader = this.fnGetConnectedTrader(socket.username);
	var service;
	// Its neccesary for avoiding to make functions within a loop
	var fnAfterAbandonedByTrader = function (){
		service.fnAbandonedByTrader();
		self.fnDeleteService(service.id);
	};

	if (connectedTrader) {
		// Notity to service rooms where trader was attending.
		for(var serviceId in connectedTrader.listServices){
			service = connectedTrader.listServices[serviceId];

			serviceService.fnAbandonedByTrader(service.id)
			.then(fnAfterAbandonedByTrader);
		}	
		// Delete trader from queue
		this.fnDeleteTraderFromQueue(socket.username);
		// Leave trader room
		this.fnLeaveTraderRoom(socket);
		// Send queue trader to traders room
		this.fnSendQueueTradersToTradersRoom();
		// Delete connected trader
		this.fnDeleteConnectedTrader(connectedTrader.user.username);
	}
};

/** 
 * Get connected gambler
 *
 * @param {String} gamblerUsername
 */
ServicesSocketService.prototype.fnGetConnectedGambler = function (gamblerUsername){
	return this.listConnectedGamblers[gamblerUsername];
};

/** 
 * Get connected trader
 *
 * @param {String} traderUsername
 */
ServicesSocketService.prototype.fnGetConnectedTrader = function (traderUsername){
	return this.listConnectedTraders[traderUsername];
};

/** 
 * Get service from list of services
 *
 * @param {String} serviceId
 */
ServicesSocketService.prototype.fnGetService = function (serviceId){
	return this.listServices[serviceId];
};

/** 
 * Get shift trader from queue
 *
 */
ServicesSocketService.prototype.fnGetShiftTrader = function(){
	var trader = this.queueTraders.shift();
	if(trader){
		this.fnQueueTrader(trader);
	}
	return trader;
};

/** 
 * Trader joins trader room.
 *
 * @param socket
 */
ServicesSocketService.prototype.fnJoinToTraderRoom = function(socket){
	socket.join(this.TRADER_ROOM);
};

/** 
 * Trader leaves trader room.
 *
 * @param socket
 */
ServicesSocketService.prototype.fnLeaveTraderRoom = function(socket){
	socket.leave(this.TRADER_ROOM);
};

/** 
 * Send chat message to service room
 *
 * @param {Object} {serviceId, message}
 */
ServicesSocketService.prototype.fnNewMessage = function(socket){
	var self = this;
	return function (socketObjectMessage){
		var service = self.fnGetService(socketObjectMessage.serviceId);

		service.fnNewMessage(socket, socketObjectMessage.message);
	};
};

/** 
 * Queue a trader.
 *
 * @param {String} traderUsername
 */
ServicesSocketService.prototype.fnQueueTrader = function(traderUsername){
	this.fnDeleteTraderFromQueue(traderUsername);
	this.queueTraders.push(traderUsername);	
};

/** 
 * Called when gambler wants to create a service.
 *
 * @param socket
 */
ServicesSocketService.prototype.fnCreateService = function(socket){
	var self = this;
	return function (socketObjectMessage){
		var serviceVO 			= socketObjectMessage.service;
		var service 			= {};
		var connectedTrader 	= {};
		var connectedGambler 	= {};
		var gamblerUsername		= socket.username;
		var traderUsername;

		try{

			// Get shift trader
			traderUsername = self.fnGetShiftTrader();

			// If there is not a trader available, send error.
			if(!traderUsername){
				self.fnSendError(socket, 'Traders not available.');
				return;
			}

			// Get sokects of the trader and gambler connected
			connectedTrader 	= self.fnGetConnectedTrader(traderUsername);
			connectedGambler 	= self.fnGetConnectedGambler(gamblerUsername);

			// Set gambler and trader id to the service
			serviceVO.gambler 	= connectedGambler.user.id;
			serviceVO.trader 	= connectedTrader.user.id;

			// Create service in DB
			serviceService.fnCreate(serviceVO)
			.then(function(serviceEntity){
				//Add service to Services Socket
				service = self.fnAddService(
					serviceEntity._id,
					connectedGambler.socket,
					connectedTrader.socket
				);

				connectedGambler.service = service;
				connectedTrader.listServices[service.id].push(service);

				// Notify to trader of the new requested service
				service.fnNotifyNewServiceToTrader();

				// Notify to glamber that trader has been assigne
				service.fnNotifyTraderAssignedToGambler();
			});

		}catch(err){
			self.fnSendError('Error creating the service. Please contact to administrator.');
			return;
		}
	};
};

/** 
 * Send error to gambler or trader.
 *
 * @param socket
 * @param error
 */
ServicesSocketService.prototype.fnSendError = function(socket, error){
	socket.emit(enumServicesSocket.app.ERROR,{
		error: error
	});
};

/** 
 * Send queue traders to trader room.
 *
 */
ServicesSocketService.prototype.fnSendQueueTradersToTradersRoom = function(){
	this.nsp.to(this.TRADER_ROOM).emit(enumServicesSocket.app.SHIFT_QUEUE,{
		queueTraders: this.queueTraders
	});
};

/** 
 * Called when traders says that service has been completed
 *
 * @param socket
 */
ServicesSocketService.prototype.fnServiceFinished = function (socket){
	var self = this;
	return function(serviceId){
		var service = self.fnGetService(serviceId);

		// Finish service
		service.fnFinish();

		// Delete service from services list
		self.fnDeleteService(service.id);
	};
};

/** 
 * Called when Gambler ask for trader availability.
 *
 * @param socket
 */
ServicesSocketService.prototype.fnTradersAvailable = function(socket){
	var self = this;
	return function(){
		var isTradersAvailable = false;
		
		if(self.queueTraders.length > 0 ){
			isTradersAvailable = true;
		}

		socket.emit(enumServicesSocket.app.TRADERS_AVAILABLE,{
			isTradersAvailable: isTradersAvailable
		});
	};
};

/** 
 * Trader decides to stop to receive services, so, It is deleted from queue and leaves from trader room.
 *
 * @param socket
 */
ServicesSocketService.prototype.fnTraderStopWorking = function(socket){
	var self = this;
	return function(){
		self.fnDeleteTraderFromQueue(socket.username);
		self.fnLeaveTraderRoom(socket);
		self.fnSendQueueTradersToTradersRoom();
		socket.emit(enumServicesSocket.app.STOP_WORKING);
	};
};

/** 
 * Trader decides to start to receive services, so, It is queued.
 *
 * @param socket
 */
ServicesSocketService.prototype.fnTraderStartWork = function(socket){
	var self = this;
	return function(){
		// Queue trader to be ready to accept requested services
		self.fnQueueTrader(socket.username);
		self.fnJoinToTraderRoom(socket);
		self.fnSendQueueTradersToTradersRoom();
	};
};