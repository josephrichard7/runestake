'use strict';

var enumUserrole			= require('../utilities/enums/userrole'),
	enumServicesSocketEvent = require('../utilities/enums/servicessocketevent'),
	enumServiceType			= require('../utilities/enums/servicetype'),
	serviceService 			= require('../services/service'),
	socketService 			= require('../services/socket'),
	BankService 			= require('../classes/bankservice'),
	errorUtil 				= require('../utilities/error');

module.exports = BankServicesSocketService;

/*jshint latedef: false */
function BankServicesSocketService(nsp){
	this.nsp 					= nsp;
	this.listConnectedBanks 	= {};
	this.listConnectedTraders 	= {};
	this.listServices			= {};
	this.queueBanks 			= [];
	this.numberServices			= 0;

	this.BANK_ROOM = 'BANK_ROOM';
}

/** 
 * Add a trader to the list of connected traders.
 *
 */
BankServicesSocketService.prototype.fnAddConnectedTrader = function(socket){
	this.listConnectedTraders[socket.username] = {
		user: 		socket.request.user,
		socket: 	socket,
		service: 	undefined
	};
};

/** 
 * Add a bank to the list of connected banks.
 *
 */
BankServicesSocketService.prototype.fnAddConnectedBank = function(socket){
	this.listConnectedBanks[socket.username] = {
		user: 			socket.request.user,
		socket: 		socket,
		listServices: 	{}
	};
};

/** 
 * Add a service created by the trader.
 *
 */
BankServicesSocketService.prototype.fnAddService = function(serviceVO, traderUsername, bankUsername){
	var self 				= this;
	var service 			= {};
	var connectedBank 		= {};
	var connectedTrader 	= {};

	// Get sokects of the bank and trader connected
	connectedBank 		= this.fnGetConnectedBank(bankUsername);
	connectedTrader 	= this.fnGetConnectedTrader(traderUsername);

	// Set trader and bank id to the service
	serviceVO.requestingUser 	= connectedTrader.user.id;
	serviceVO.attendantUser 	= connectedBank.user.id;
	serviceVO.type 				= enumServiceType.BUYCHIPSTOBANK;

	// Create service in DB
	return serviceService.fnCreate(serviceVO)
	.then(function(serviceEntity){
		service = new BankService(serviceEntity._id, connectedTrader.socket, connectedBank.socket, self.nsp);

		self.listServices[service.id] = service;
		self.numberServices++;

		connectedTrader.service 				= service;
		connectedBank.listServices[service.id] 	= service;

		return service;
	});
};

/** 
 * Called when trader wants to create a service.
 *
 * @param socket
 */
BankServicesSocketService.prototype.fnCreateService = function(socket){
	var self = this;
	return function (socketObjectMessage){
		var serviceVO = {};
		var traderUsername;
		var bankUsername;

		try{
			// Assign service data from incoming object message
			serviceVO = socketObjectMessage.service;

			// Assign trader username from incoming socket
			traderUsername = socket.username;

			// Get shift bank
			bankUsername = self.fnGetShiftBank();

			// If there is not a bank available, send error.
			if(!bankUsername){
				self.fnSendError(socket, 'Bank is not available.');
				return;
			}

			//Add service to Services Socket
			self.fnAddService(
				serviceVO,
				traderUsername,
				bankUsername
			)
			// Send default message to service room
			.then(function(service){
				service.fnSendDefaultMessageToServiceRoom();
			})
			.then(null, function (err) {
				self.fnSendError(socket, errorUtil.getErrorMessage(err));
			});

		}catch(err){
			self.fnSendError(socket, 'Error creating the service. Please contact to administrator.');
		}
	};
};

/** 
 * Called when banks decides to complete the service
 *
 * @param socket
 */
BankServicesSocketService.prototype.fnCompleteService = function (socket){
	var self = this;
	return function(socketObjectMessage){
		var service 		= self.fnGetService(socketObjectMessage.serviceId);
		var connectedBank 	= self.fnGetConnectedBank(socket.username);

		if(service && connectedBank){
			// Apply service to be completed
			serviceService.fnComplete(service.id)
			.then(function(){
				// Service Completed
				service.fnComplete();

				// Delete service from services list
				self.fnDeleteService(service.id);
			})
			.then(null, function (err) {
				self.fnSendError(connectedBank.socket, errorUtil.getErrorMessage(err));
			});
		}
	};
};
	
/** 
 * Connects a new trader or bank.
 *
 */
BankServicesSocketService.prototype.fnConnectUser = function(socket){
	socket.username = socket.request.user.username;

	if(socket.request.user.role === enumUserrole.BANK){
		// Connect new bank to be ready to accept service requests
		this.fnConnectBank(socket);
	}else if(socket.request.user.role === enumUserrole.TRADER){
		// Connect new trader to a service room
		this.fnConnectTrader(socket);
	}

	socketService.fnEmitToMe(socket, enumServicesSocketEvent.app.CONNECTED_USER);
};

/** 
 * Connects a new trader.
 *
 */
BankServicesSocketService.prototype.fnConnectTrader = function(socket){
	var connectedTrader = this.fnGetConnectedTrader(socket.username);

	if(connectedTrader){
		connectedTrader.socket = socket;
	}else{
		this.fnAddConnectedTrader(socket);
	}

	// Event handlers
	socket.on(enumServicesSocketEvent.app.BANKS_AVAILABLE,		this.fnBanksAvailable(socket));
	socket.on(enumServicesSocketEvent.app.CREATE_SERVICE, 		this.fnCreateService(socket));
	socket.on(enumServicesSocketEvent.app.DESIST_SERVICE,		this.fnDesistService(socket));
	socket.on(enumServicesSocketEvent.app.NEW_MESSAGE_SERVICE, 	this.fnNewMessage(socket));
	socket.on(enumServicesSocketEvent.natives.DISCONNECT, 		this.fnDisconnection(socket));
};

/** 
 * Connects a new bank.
 *
 */
BankServicesSocketService.prototype.fnConnectBank = function(socket){
	var connectedBank = this.fnGetConnectedBank(socket.username);

	if(connectedBank){
		connectedBank.socket = socket;
	}else{
		this.fnAddConnectedBank(socket);
	}

	// Event handlers
	socket.on(enumServicesSocketEvent.app.START_WORK, 			this.fnBankStartWork(socket));
	socket.on(enumServicesSocketEvent.app.STOP_WORKING, 		this.fnBankStopWorking(socket));
	socket.on(enumServicesSocketEvent.app.NEW_MESSAGE_SERVICE, 	this.fnNewMessage(socket));
	socket.on(enumServicesSocketEvent.app.COMPLETE_SERVICE,		this.fnCompleteService(socket));
	socket.on(enumServicesSocketEvent.natives.DISCONNECT, 		this.fnDisconnection(socket));
};

/** 
 * Delete connected trader
 *
 * @param {String} traderUsername
 */
BankServicesSocketService.prototype.fnDeleteConnectedTrader = function (traderUsername){
	delete this.listConnectedTraders[traderUsername];
};

/** 
 * Delete connected bank
 *
 * @param {String} bankUsername
 */
BankServicesSocketService.prototype.fnDeleteConnectedBank = function (bankUsername){
	delete this.listConnectedBanks[bankUsername];
};

/** 
 * Delete service from list of services, from list services of the banks and from trader
 *
 * @param {String} serviceId
 */
BankServicesSocketService.prototype.fnDeleteService = function (serviceId){
	var service 			= this.fnGetService(serviceId);
	var connectedBank 		= this.fnGetConnectedBank(service.bankSocket.username);
	var connectedTrader 	= this.fnGetConnectedTrader(service.traderSocket.username);

	// Delete from list of services
	if(service && this.listServices[service.id]){
		delete this.listServices[service.id];
	}

	// Delete from list services of the bank
	if(connectedBank && connectedBank.listServices[service.id]){
		delete connectedBank.listServices[service.id];		
	}

	// Delete from service of the trader
	if(connectedTrader && connectedTrader.service && connectedTrader.service.id === service.id){
		delete connectedTrader.service;
	}
};

/** 
 * Delete a bank from queue
 *
 */
BankServicesSocketService.prototype.fnDeleteBankFromQueue = function(bankUsername){
	var index = this.queueBanks.indexOf(bankUsername);
	if(index >= 0){
		this.queueBanks.splice(index,1);
		this.fnDeleteBankFromQueue(bankUsername);
	}
};

/** 
 * Called when trader decides to desist the service
 *
 * @param socket
 */
BankServicesSocketService.prototype.fnDesistService = function (socket){
	var self = this;
	return function(socketObjectMessage){
		var service 			= self.fnGetService(socketObjectMessage.serviceId);
		var connectedTrader 	= self.fnGetConnectedTrader(socket.username);

		if(service && connectedTrader){
			// Apply service to be completed
			serviceService.fnDesist(service.id)
			.then(function(){
				// Service Desisted
				service.fnDesist();

				// Delete service from services list
				self.fnDeleteService(service.id);
			})
			.then(null, function (err) {
				self.fnSendError(connectedTrader.socket, errorUtil.getErrorMessage(err));
			});
		}
	};
};

/** 
 * Called upon client disconnects. Disconnect trader or bank from namespace.
 *
 */
BankServicesSocketService.prototype.fnDisconnection = function(socket){
	var self = this;
	return function(){
		if(socket.request.user.role === enumUserrole.BANK){
			self.fnDisconnectBank(socket);
		}else if(socket.request.user.role === enumUserrole.TRADER){
			self.fnDisconnectTrader(socket);
		}		
	};
};

/** 
 * Disconnect trader.
 *
 * @param socket
 */
BankServicesSocketService.prototype.fnDisconnectTrader = function (socket){
	var self = this;
	var connectedTrader = this.fnGetConnectedTrader(socket.username);

	if (connectedTrader) {
		// If Trader is attending a service, notify that it has beed abandoned
		if(connectedTrader.service){
			serviceService.fnAbandonedByTrader(connectedTrader.service.id)
			.then(function(){
				connectedTrader.service.fnAbandonedByTrader();
			})
			.then(null, function (err) {
				self.fnSendError(connectedTrader.socket, errorUtil.getErrorMessage(err));
			});

		}
		// Delete connected trader
		this.fnDeleteConnectedTrader(connectedTrader.user.username);
	}
};

/** 
 * Disconnect bank.
 *
 * @param socket
 */
BankServicesSocketService.prototype.fnDisconnectBank = function (socket){
	var self 			= this;
	var connectedBank 	= this.fnGetConnectedBank(socket.username);
	var service;
	var fnAfterAbandonedByBank = function(){
		service.fnAbandonedByBank();
		self.fnDeleteService(service.id);
	};
	var fnCatchErrorAbandonedByBank = function(err){
		self.fnSendError(connectedBank.socket, errorUtil.getErrorMessage(err));
	};

	if (connectedBank) {
		// Notity to service rooms where bank was attending.
		for(var serviceId in connectedBank.listServices){
			service = connectedBank.listServices[serviceId];

			// Update state of the service
			serviceService.fnAbandonedByBank(service.id)
			.then(fnAfterAbandonedByBank)
			.then(null, fnCatchErrorAbandonedByBank);
		}	
		// Delete bank from queue
		this.fnDeleteBankFromQueue(socket.username);
		// Leave bank room
		this.fnLeaveBankRoom(socket);
		// Send queue bank to banks room
		this.fnSendQueueBanksToBanksRoom();
		// Delete connected bank
		this.fnDeleteConnectedBank(connectedBank.user.username);
	}
};

/** 
 * Get connected trader
 *
 * @param {String} traderUsername
 */
BankServicesSocketService.prototype.fnGetConnectedTrader = function (traderUsername){
	return this.listConnectedTraders[traderUsername];
};

/** 
 * Get connected bank
 *
 * @param {String} bankUsername
 */
BankServicesSocketService.prototype.fnGetConnectedBank = function (bankUsername){
	return this.listConnectedBanks[bankUsername];
};

/** 
 * Get service from list of services
 *
 * @param {String} serviceId
 */
BankServicesSocketService.prototype.fnGetService = function (serviceId){
	return this.listServices[serviceId];
};

/** 
 * Get shift bank from queue
 *
 */
BankServicesSocketService.prototype.fnGetShiftBank = function(){
	var bank = this.queueBanks.shift();
	if(bank){
		this.fnQueueBank(bank);
	}
	return bank;
};

/** 
 * Bank joins bank room.
 *
 * @param socket
 */
BankServicesSocketService.prototype.fnJoinToBankRoom = function(socket){
	socket.join(this.BANK_ROOM);
};

/** 
 * Bank leaves bank room.
 *
 * @param socket
 */
BankServicesSocketService.prototype.fnLeaveBankRoom = function(socket){
	socket.leave(this.BANK_ROOM);
};

/** 
 * Send chat message to service room
 *
 * @param {Object} {serviceId, message}
 */
BankServicesSocketService.prototype.fnNewMessage = function(socket){
	var self = this;
	return function (socketObjectMessage){
		var service = self.fnGetService(socketObjectMessage.serviceId);

		service.fnNewMessage(socket, socketObjectMessage.message);
	};
};

/** 
 * Queue a bank.
 *
 * @param {String} bankUsername
 */
BankServicesSocketService.prototype.fnQueueBank = function(bankUsername){
	this.fnDeleteBankFromQueue(bankUsername);
	this.queueBanks.push(bankUsername);	
};

/** 
 * Send error to trader or bank.
 *
 * @param socket
 * @param error
 */
BankServicesSocketService.prototype.fnSendError = function(socket, error){
	socketService.fnEmitToMe(socket, enumServicesSocketEvent.app.ERROR, {
		error: error
	});
};

/** 
 * Send queue banks to bank room.
 *
 */
BankServicesSocketService.prototype.fnSendQueueBanksToBanksRoom = function(){
	socketService.fnEmitToRoom(this.nsp, this.BANK_ROOM, enumServicesSocketEvent.app.SHIFT_QUEUE, {
		queueBanks: this.queueBanks
	});
};

/** 
 * Called when Trader ask for bank availability.
 *
 * @param socket
 */
BankServicesSocketService.prototype.fnBanksAvailable = function(socket){
	var self = this;
	return function(){
		var connectedTrader 	= self.fnGetConnectedTrader(socket.username);
		var isBanksAvailable 	= false;
		var message 			= 'Banks are NOT available.';
		
		if(self.queueBanks.length > 0 ){
			isBanksAvailable 	= true;
			message 			= 'Banks are available.';
		}

		socketService.fnEmitToMe(connectedTrader.socket, enumServicesSocketEvent.app.BANKS_AVAILABLE, {
			isBanksAvailable: 	isBanksAvailable,
			message: 			message
		});
	};
};

/** 
 * Bank decides to stop to receive services, so, It is deleted from queue and leaves from bank room.
 *
 * @param socket
 */
BankServicesSocketService.prototype.fnBankStopWorking = function(socket){
	var self = this;
	return function(){
		self.fnDeleteBankFromQueue(socket.username);
		self.fnLeaveBankRoom(socket);
		self.fnSendQueueBanksToBanksRoom();
		socketService.fnEmitToMe(socket, enumServicesSocketEvent.app.STOP_WORKING);
	};
};

/** 
 * Bank decides to start to receive services, so, It is queued.
 *
 * @param socket
 */
BankServicesSocketService.prototype.fnBankStartWork = function(socket){
	var self = this;
	return function(){
		// Queue bank to be ready to accept requested services
		self.fnQueueBank(socket.username);
		self.fnJoinToBankRoom(socket);
		self.fnSendQueueBanksToBanksRoom();
	};
};