'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.service(ApplicationConfiguration.services.gamblermain, 
	['$resource',
	 '$location',
	ApplicationConfiguration.services.authentication, 
	ApplicationConfiguration.services.account,
	ApplicationConfiguration.services.service,
	ApplicationConfiguration.factories.chat,	 
  	ApplicationConfiguration.services.utilities,
	function($resource, $location, Authentication, accountSrv, serviceSrv, ChatFactory, utilSrv) {
		var _this = this;

		var enumServicesSocketEvent = {
			// Native events
			natives: {
				CONNECTION: 	'connect',
				DISCONNECT:		'disconnect'
			},
			// App events
			app: {
				ABANDONED_BY_GAMBLER: 	'ABANDONED_BY_GAMBLER',
				ABANDONED_BY_TRADER: 	'ABANDONED_BY_TRADER',
				CREATE_SERVICE: 		'CREATE_SERVICE',
				COMPLETE_SERVICE: 		'COMPLETE_SERVICE',
				CONNECTED_USER: 		'CONNECTED_USER',
				DESIST_SERVICE: 		'DESIST_SERVICE',
				ERROR: 					'ERROR',
				NEW_MESSAGE_SERVICE:	'NEW_MESSAGE_SERVICE',
				NEW_SERVICE: 			'NEW_SERVICE',
				SHIFT_QUEUE: 			'SHIFT_QUEUE',
				START_WORK: 			'START_WORK',
				STOP_WORKING: 			'STOP_WORKING',
				SERVICE_CREATED: 		'SERVICE_CREATED',
				SERVICE_COMPLETED: 		'SERVICE_COMPLETED',
				SERVICE_DESISTED: 		'SERVICE_DESISTED',
				TRADERS_AVAILABLE: 		'TRADERS_AVAILABLE'
			}
		};

		_this.gamblerResource 		= $resource('gambler/:gamblerId', {
			gamblerId: '@_id'
		});
		
		_this.servicesSocket 		= undefined;
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
	    _this.enumServiceState = {
			CREATED: 				'CREATED',
			COMPLETED: 				'COMPLETED',
			DESISTED: 				'DESISTED',
			ABANDONED_BY_GAMBLER: 	'ABANDONED_BY_GAMBLER',
			ABANDONED_BY_TRADER: 	'ABANDONED_BY_TRADER'
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

		_this.fnCreateService = function (){
			_this.servicesSocket.socket.emit(enumServicesSocketEvent.app.CREATE_SERVICE, {
				service: _this.service
			});
		};

		_this.fnDesistService = function (){
			_this.servicesSocket.socket.emit(enumServicesSocketEvent.app.DESIST_SERVICE, {
				serviceId: _this.service._id
			});
		};

		function fnErrorHandling(err) {
			_this.error = err.data.message;
		}

		_this.fnInitServicesSocket = function(){
			if(!_this.servicesSocket){
				_this.servicesSocket =  new ChatFactory(ApplicationConfiguration.sockets.services);

				_this.fnOnConnectedUser();
				_this.fnOnError();
	      		_this.fnOnNewMessage();
	      		_this.fnOnServiceAbandonedByTrader();
				_this.fnOnServiceCreated();
				_this.fnOnServiceDesisted();
				_this.fnOnTradersAvailable();
			}
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

		_this.fnOnServiceAbandonedByTrader = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.ABANDONED_BY_TRADER, function(data){
				utilSrv.util.go('gamblermainState.cashier.srvstate',{
		        	id: data.serviceId
		        });
				if(callback){
					callback();
				}
			});
		};

		_this.fnOnServiceCreated = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.SERVICE_CREATED, function(data){
				_this.fnLoadListServices();
				utilSrv.util.go('gamblermainState.cashier.srvcreated',{
					id: data.serviceId
				});

				if(callback){
					callback();
				}
			});
		};

		_this.fnOnServiceDesisted = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.SERVICE_DESISTED, function(data){
				_this.fnLoadListServices();
		        utilSrv.util.go('gamblermainState.cashier.srvstate',{
		        	id: data.serviceId
		        });

				if(callback){
					callback();
				}
			});
		};

		_this.fnOnServiceCompleted = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.SERVICE_COMPLETED, function(data){
				_this.fnLoadListServices();
		        utilSrv.util.go('gamblermainState.cashier.srvstate',{
		        	id: data.serviceId
		        });

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
	}
]);