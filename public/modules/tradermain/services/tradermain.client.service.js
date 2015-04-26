'use strict';

angular.module(ApplicationConfiguration.modules.tradermain)
.service(ApplicationConfiguration.services.tradermain, 
	['$resource', 	 
	 '$q',
	 ApplicationConfiguration.services.authentication, 
	 ApplicationConfiguration.services.account,
	 ApplicationConfiguration.services.service,
	 ApplicationConfiguration.services.trader,
	 ApplicationConfiguration.factories.chat,	 
	function($resource, $q, Authentication, accountSrv, serviceSrv, traderSrv, ChatFactory) {
		var _this 		= this;

		var enumServicesSocketEvent = {
			// Native events
			natives: {
				CONNECTION: 	'connect',
				DISCONNECT:		'disconnect',	
			},
			// App events
			app: {
				CONNECTED_USER: 	'CONNECTED_USER',
				TRADERS_AVAILABLE: 	'TRADERS_AVAILABLE',
				START_WORK: 		'START_WORK',
				SHIFT_QUEUE: 		'SHIFT_QUEUE',
				STOP_WORKING: 		'STOP_WORKING',
				REQUEST_TRADER: 	'REQUEST_TRADER',
				TRADER_ASSIGNED: 	'TRADER_ASSIGNED ',
				NEW_SERVICE: 		'NEW_SERVICE',
				NEW_MESSAGE_SERVICE:'NEW_MESSAGE_SERVICE',
				SERVICE_FINISHED: 	'SERVICE_FINISHED',
				ERROR: 				'ERROR'
			}
		};

		// _this.traderResource 		= $resource('tradermain/:traderId', {
		// 	traderId: '@_id'
		// });
		
		_this.servicesSocket 			= {};
		_this.authentication 			= Authentication;
		_this.trader 					= {};
		_this.trader.account 			= {};
		_this.service 					= {};
		_this.arrayServices 			= [];
		_this.listServicesAttending		= {};
		_this.arrayServicesAttending	= [];
		_this.queueTraders 				= [];
		_this.error 					= undefined;
		_this.info 						= undefined;
		_this.isWorking 				= false;
		_this.enumUserRole = {
	      ADMIN:    'ADMIN',
	      BANK:     'BANK',
	      TRADER:   'TRADER',
	      GAMBLER:  'GAMBLER'
	    };

	    _this.fnAddChatMessage = function(serviceId, username, role, message, type) {
	    	var objMessage 			= {};
	    	var serviceAttending 	= _this.listServicesAttending[serviceId];

	    	if(serviceAttending){
				objMessage = {
					username: 	username,
					message:  	message,
					role: 		role,
					type:     	type
				};
				serviceAttending.listChatMessages.push(objMessage);
			}
	    };

		function fnErrorHandling(err) {
			_this.error = err.data.message;
		}

		_this.fnInitServicesSocket = function(){
			_this.servicesSocket =  new ChatFactory(ApplicationConfiguration.sockets.services);

			_this.fnOnConnectedUser(function(){
				// _this.fnStartWork();
			});
			_this.fnOnShiftQueue();
			_this.fnOnNewService();
			_this.fnOnNewMessage();
			_this.fnOnError();
		};

		_this.fnLoadListServices = function (){
			return serviceSrv.fnLoadListServices()
			.then(function(arrayServices){
				_this.arrayServices = arrayServices;
				return _this.arrayServices;
			})
			.catch(fnErrorHandling);
		};

		_this.fnLoadUser = function (){
			return traderSrv.get({
				id: _this.authentication.user._id
			}).$promise
			.then(function(trader){
				_this.trader = trader;
				return _this.trader;
			})
			.then(function(trader){
				return accountSrv.fnReadAccountByUserId(trader._id)
				.then(function(account){
					_this.trader.account = account;
					return _this.trader;
				});
			})
			.catch(fnErrorHandling);
		};

		_this.fnOnConnectedUser = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.CONNECTED_USER, function(){
				if(callback){
					callback();
				}
			});
		};

		_this.fnOnError = function (){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.ERROR, function(error){
				_this.error = error.error;
			});
		};

		_this.fnOnNewMessage = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.NEW_MESSAGE_SERVICE, function(data){
				_this.fnAddChatMessage(
					data.serviceId,
					data.username, 
					data.role, 
					data.message,
					''
				);
		    	if(callback){
		    		callback();
		    	}
			});
		};

		_this.fnOnNewService = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.NEW_SERVICE, function(obj){
				serviceSrv.fnReadServiceById(obj.serviceId)
				.then(function(service){
					_this.arrayServicesAttending.unshift({
						service: service
					});
					_this.listServicesAttending[obj.serviceId] = {
						service: 			service,
						listChatMessages: 	[]
					};
				})
				.catch(fnErrorHandling);

				if(callback){
					callback();
				}
			});
		};

		_this.fnOnShiftQueue = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.SHIFT_QUEUE, function(obj){
				_this.queueTraders = obj.queueTraders;
				if(callback){
					callback();
				}
			});
		};

		_this.fnOnStopWorking = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.STOP_WORKING, function(){
				_this.queueTraders = [];
				if(callback){
					callback();
				}
			});
		};

		_this.fnReadServiceById = function (id){
			return serviceSrv.fnReadServiceById(id)
			.then(function(service){
				_this.service = service;
				return _this.service;
			})
			.catch(fnErrorHandling);
		};

		_this.fnRemoveService = function (index, serviceId){
			var service = _this.arrayServicesAttending[index];

			if(service._id === serviceId){
				_this.arrayServicesAttending.splice(index,1);
				delete _this.listServicesAttending[service._id];
			}
		};

		_this.fnResetService = function (){
			_this.service = {};
		};

		_this.fnServiceFinished = function (){
			_this.servicesSocket.socket.emit(enumServicesSocketEvent.app.START_WORK,{
				serviceId: _this.service._id
			});
		};

		_this.fnSendMessage = function (serviceId, message, callback){
			_this.servicesSocket.socket.emit(enumServicesSocketEvent.app.NEW_MESSAGE_SERVICE, {
				serviceId: 	serviceId,
				message: 	message
			});
			if(callback){
				callback();
			}
		};

		_this.fnStartWork = function (){
			_this.servicesSocket.socket.emit(enumServicesSocketEvent.app.START_WORK);
			_this.isWorking = true;
		};

		_this.fnStopWorking = function (){
			_this.servicesSocket.socket.emit(enumServicesSocketEvent.app.STOP_WORKING);
			_this.isWorking = false;
		};

		_this.fnInitServicesSocket();
	}
]);