'use strict';

var _ 					= require('lodash'),
	enumUserrole		= require('../utilities/enums/userrole'),
	enumServicesSocket 	= require('../utilities/enums/servicessocketevent'),
	serviceService 		= require('../services/serviceService');

module.exports = new ServicesSocketService();

/*jshint latedef: false */
function ServicesSocketService(){
}

ServicesSocketService.fnAddServiceInProcess = function(serviceId, gamblerSocket, traderSocket, listServices){	
	var service = {
		serviceId: 		serviceId,
		gamblerSocket: 	gamblerSocket,
		traderSocket: 	traderSocket
	};
	listServices[serviceId] = service;

	return service;
};

/** 
 * Called upon new client connects. Add new user to namespace.
 *
 */
ServicesSocketService.prototype.fnConnectUser = function(socket, servicesSocketNsp){
	if(socket.request.user.role === enumUserrole.TRADER){
		// Connect new trader to be ready to accept service requests
		ServicesSocketService.fnConnectTrader(socket, servicesSocketNsp.listConnectedTraders);
	}else if(socket.request.user.role === enumUserrole.GAMBLER){
		// Connect new gambler to a service room
		ServicesSocketService.fnConnectGambler(socket, servicesSocketNsp.listConnectedGamblers);
	}
	socket.emit(enumServicesSocket.app.CONNECTED_USER);
};

/** 
 * Called upon new gambler request a service.
 *
 */
ServicesSocketService.fnConnectGambler = function(socket, listConnectedGamblers){
	if(socket.request.user.role === enumUserrole.GAMBLER && !listConnectedGamblers[socket.username]){
		listConnectedGamblers[socket.username] = {
			userId: 	socket.id,
			username: 	socket.username,
			role: 		socket.role,
			socket: 	socket
		};
	}
};

/** 
 * Called upon new trader connects.
 *
 */
ServicesSocketService.fnConnectTrader = function(socket, listConnectedTraders){
	if(socket.request.user.role === enumUserrole.TRADER && !listConnectedTraders[socket.username]){
		listConnectedTraders[socket.username] = {
			userId: 		socket.id,
			username: 		socket.username,
			role: 			socket.role,
			socket: 		socket,
			listServices: 	{}
		};
	}
};

ServicesSocketService.fnDeleteTraderFromQueue = function(trader, queueTraders){
	var index = queueTraders.indexOf(trader);
	if(index >= 0){
		queueTraders.splice(index,1);
		ServicesSocketService.fnDeleteTraderFromQueue(trader, queueTraders);
	}
};


ServicesSocketService.fnGetShiftTrader = function(queueTraders){
	var trader = queueTraders.shift();
	if(trader){
		ServicesSocketService.fnQueueTrader(trader, queueTraders);
	}
	return trader;
};

/** 
 * Called upon client disconnects. Disconnect user from namespace.
 *
 */
ServicesSocketService.prototype.fnDisconnection = function(socket, servicesSocketNsp){
	return function(){
		if(socket.request.user.role === enumUserrole.TRADER){
			if (servicesSocketNsp.listConnectedTraders[socket.username]) {
				delete servicesSocketNsp.listConnectedTraders[socket.username];
				--servicesSocketNsp.numConnectedUsers;

				// echo globally that this client has left, including me
				socket.broadcast.emit(enumServicesSocket.app.USER_LEFT, {
					username: 			socket.username,
					numConnectedUsers: 	servicesSocketNsp.numConnectedUsers,
					listConnectedTraders: _.values(servicesSocketNsp.listConnectedUsers)
				});
			}
		}else if(socket.request.user.role === enumUserrole.GAMBLER){
			if (servicesSocketNsp.listConnectedUsers[socket.username]) {
				delete servicesSocketNsp.listConnectedUsers[socket.username];
				--servicesSocketNsp.numConnectedUsers;

				// echo globally that this client has left, including me
				socket.broadcast.emit(enumServicesSocket.app.USER_LEFT, {
					username: 			socket.username,
					numConnectedUsers: 	servicesSocketNsp.numConnectedUsers,
					listConnectedUsers: _.values(servicesSocketNsp.listConnectedUsers)
				});
			}
		}		
	};
};

ServicesSocketService.fnGetServiceRoomName = function(serviceId){
	return 'room-' + serviceId;
};

ServicesSocketService.fnJoinToServiceRoom = function(serviceAssigned){
	var serviceRoom = ServicesSocketService.fnGetServiceRoomName(serviceAssigned.serviceId);

	serviceAssigned.traderSocket.join(serviceRoom);
	serviceAssigned.gamblerSocket.join(serviceRoom);
};

ServicesSocketService.fnJoinToTraderRoom = function(socket, servicesSocketNsp){
	socket.join(servicesSocketNsp.TRADER_ROOM);
};

ServicesSocketService.fnLeaveServiceRoom = function(serviceAssigned){
	var serviceRoom = 'room-'+serviceAssigned.serviceId;
	
	serviceAssigned.traderSocket.leave(serviceRoom);
	serviceAssigned.gamblerSocket.leave(serviceRoom);
};

ServicesSocketService.fnLeaveTraderRoom = function(socket, servicesSocketNsp){
	socket.leave(servicesSocketNsp.TRADER_ROOM);
};

/** 
 * Send chat message to trader or gambler users connected.
 *
 * @param {String} message
 */
ServicesSocketService.prototype.fnNewMessage = function(socket, servicesSocketNsp){
	return function (socketObjectMessage){
		var serviceRoom = ServicesSocketService.fnGetServiceRoomName(socketObjectMessage.serviceId);

		servicesSocketNsp.to(serviceRoom).emit(enumServicesSocket.app.NEW_MESSAGE, {
			serviceId: 	socketObjectMessage.serviceId,
			username: 	socket.username,
			role: 		socket.role,
			message:  	socketObjectMessage.message
		});	
	};
};

ServicesSocketService.fnProcessService = function(serviceId, socket, servicesSocketNsp){
	var trader 				= {};
	var traderSocket		= {};
	var serviceAssigned 	= {};

	// Get the first trader in the queue
	trader = ServicesSocketService.fnGetShiftTrader();

	if(trader){
		// Get trader socket
		traderSocket = servicesSocketNsp.listConnectedTraders[trader].socket;

		//Update service state
		serviceService.fnAssignTrader(serviceId, traderSocket.userId)
		.then(function(){
			serviceAssigned = ServicesSocketService.fnAddServiceAssigned(
				serviceId,
				socket,
				traderSocket,
				servicesSocketNsp.listServices
			);

			ServicesSocketService.fnProcessServiceAssigned(serviceAssigned);
		});
	}else{
		ServicesSocketService.fnSendError('Traders not available.');
		return;
	}
};

ServicesSocketService.fnProcessServiceAssigned = function(serviceAssigned){
	// Notify to trader of the new requested service
	serviceAssigned.traderSocket.emit(enumServicesSocket.app.NEW_SERVICE,{
		serviceId: serviceAssigned.serviceId
	});

	// Notify to glamber that trader has been assigned
	serviceAssigned.gamblerSocket.emit(enumServicesSocket.app.TRADER_ASSIGNED,{
		trader: serviceAssigned.traderSocket.username
	});

	ServicesSocketService.fnJoinToServiceRoom(serviceAssigned);
};

ServicesSocketService.fnQueueTrader = function(trader, queueTraders){
	ServicesSocketService.fnDeleteTraderFromQueue(trader, queueTraders);
	queueTraders.push(trader);	
};

/** 
 * Send chat message to all users connected.
 *
 * @param {String} message
 */
ServicesSocketService.prototype.fnRequestTrader = function(socket, servicesSocketNsp){
	return function (socketObjectMessage){
		var serviceId			= socketObjectMessage.serviceId;
		var serviceAssigned 	= {};

		serviceAssigned = ServicesSocketService.fnGetServiceAssigned(serviceId, servicesSocketNsp.listServices);

		if(serviceAssigned){
			ServicesSocketService.fnProcessServiceAssigned(serviceAssigned);
		}else{
			ServicesSocketService.fnProcessService(serviceId, socket, servicesSocketNsp);
		}
	};
};

ServicesSocketService.fnSendError = function(socket, error){
	socket.emit(enumServicesSocket.app.ERROR,{
		error: error
	});
};

ServicesSocketService.fnSendShiftQueueToTraders = function(servicesSocketNsp){
	servicesSocketNsp.to(servicesSocketNsp.TRADER_ROOM).emit(enumServicesSocket.app.SHIFT_QUEUE,{
		queueTraders: servicesSocketNsp.queueTraders
	});
};

ServicesSocketService.fnServiceInProcess = function (serviceId, listServices){
	return listServices[serviceId];
	// ServicesSocketService.fnSendError('This service is already in process.');
};

ServicesSocketService.fnTraderStopWorking = function(socket, servicesSocketNsp){
	ServicesSocketService.fnDeQueueTrader(socket, servicesSocketNsp);
	ServicesSocketService.fnLeaveTraderRoom(socket, servicesSocketNsp);
	socket.emit(enumServicesSocket.app.STOP_WORKING);
	// ServicesSocketService.fnSendShiftQueueToTradersRoom(socket, servicesSocketNsp); //TODO Por confirmar
};

/** 
 * Trader decide to start to receive services, so, It is queued.
 *
 * @param
 */
ServicesSocketService.prototype.fnTraderStartWork = function(socket, servicesSocketNsp){
	return function(){
		// Queue trader to be ready to accept requested services
		ServicesSocketService.fnQueueTrader(socket.username, servicesSocketNsp.queueTraders);
		ServicesSocketService.fnJoinToTraderRoom(socket, servicesSocketNsp);
		ServicesSocketService.fnSendShiftQueueToTradersRoom(servicesSocketNsp);
	};
};