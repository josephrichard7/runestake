'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.service(ApplicationConfiguration.services.gamblermain, 
	['$resource',
	 '$location',
	 ApplicationConfiguration.services.authentication, 
	 ApplicationConfiguration.services.account,
	 ApplicationConfiguration.services.service,
	 ApplicationConfiguration.factories.chat,	 
	function($resource, $location, Authentication, accountSrv, serviceSrv, ChatFactory) {
		var _this = this;

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

		_this.gamblerResource 		= $resource('gamblermain/:gamblerId', {
			gamblerId: '@_id'
		});
		
		_this.servicesSocket 		= {};
		_this.authentication 		= Authentication;
		_this.gambler 				= {};
		_this.gambler.account 		= {};
		_this.service 				= {};
		_this.listServices 			= [];
		_this.error 				= undefined;
		_this.info 					= undefined;
		_this.isTraderAssigned		= false;
		_this.enumUserRole   		= {
	      ADMIN:    'ADMIN',
	      BANK:     'BANK',
	      TRADER:   'TRADER',
	      GAMBLER:  'GAMBLER'
	    };

	    // Add chat message to list
	    _this.fnAddChatMessage = function(username, role, message, type) {
			var objMessage = {
				username: 	username,
				message:  	message,
				role: 		role,
				type:     	type
			};
			_this.servicesSocket.listMessages.push(objMessage);
	    };

		_this.fnCancelService = function (){
			return serviceSrv.fnCancelService(_this.service._id)
			.then(function(service){
				_this.service = service;
				return _this.service;
			})
			.catch(fnErrorHandling);
		};

		_this.fnCreateService = function (){
			return serviceSrv.fnCreateService(_this.service)
			.then(function(service){
				_this.service = service;
				return _this.service;
			})
			.catch(fnErrorHandling);
		};

		_this.fnDesistService = function (){
			return serviceSrv.fnDesistService(_this.service._id)
			.then(function(service){
				_this.service = service;
				return _this.service;
			})
			.catch(fnErrorHandling);
		};

		function fnErrorHandling(err) {
			_this.error = err.data.message;
		}

		_this.fnInitServicesSocket = function(){
			_this.servicesSocket =  new ChatFactory(ApplicationConfiguration.sockets.services);

			_this.fnOnConnectedUser();
			_this.fnOnTraderAssigned(function(serviceId){
				_this.fnLoadListServices();
				$location.path('/gamblermain/panel/cashier/srvassigned/'+serviceId);
			});
      		_this.fnOnNewMessage();
			_this.fnOnTradersAvailable();
			_this.fnOnError();
		};

		_this.fnLoadListServices = function (){
			return serviceSrv.fnLoadListServices()
			.then(function(listServices){
				_this.listServices = listServices;
				return _this.listServices;
			})
			.catch(fnErrorHandling);
		};

		_this.fnLoadUser = function (){
			return _this.gamblerResource.get({
				gamblerId: _this.authentication.user._id
			}).$promise
			.then(function(gambler){
				_this.gambler = gambler;
				return _this.gambler;
			})
			.then(function(gambler){
				return accountSrv.fnReadAccountByUserId(gambler._id)
				.then(function(account){
					_this.gambler.account = account;
					return _this.gambler;
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

		_this.fnOnTradersAvailable = function (){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.TRADERS_AVAILABLE, function(obj){
				if(obj.isTradersAvailable){
					_this.info = 'Traders are available.';
				}else{
					_this.error = 'Traders are NOT available.';
				}
			});
		};

		_this.fnOnTraderAssigned = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.TRADER_ASSIGNED, function(obj){
				_this.isTraderAssigned = true;
				if(callback){
					callback(obj.serviceId);
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

		_this.fnRequestTrader = function (){
			_this.servicesSocket.socket.emit(enumServicesSocketEvent.app.REQUEST_TRADER, {
				serviceId: _this.service._id
			});
		};

		_this.fnResetService = function (){
			_this.service = {};
		};

		_this.fnSendMessage = function (message, callback){
			_this.servicesSocket.socket.emit(enumServicesSocketEvent.app.NEW_MESSAGE_SERVICE, {
				serviceId: 	_this.service._id,
				message: 	message
			});
			if(callback){
				callback();
			}
		};

		_this.fnTradersAvailable = function (){
			_this.servicesSocket.socket.emit(enumServicesSocketEvent.app.TRADERS_AVAILABLE);
		};
	
      
      	_this.fnInitServicesSocket();	
	}
]);