'use strict';

angular.module(ApplicationConfiguration.modules.bankmain)
.service(ApplicationConfiguration.services.bankmain, [
	ApplicationConfiguration.services.authentication, 
	ApplicationConfiguration.services.account,
	ApplicationConfiguration.services.service,
	ApplicationConfiguration.services.bank,
	ApplicationConfiguration.factories.socket,	 
  	ApplicationConfiguration.services.utilities, 
	function(Authentication, accountSrv, serviceSrv, bankSrv, SocketFactory, utilSrv) {
		var _this = this;

		var enumServicesSocketEvent = {
			// Native events
			natives: {
				CONNECTION: 	'connect',
				DISCONNECT:		'disconnect'
			},
			// App events
			app: {
				ABANDONED_BY_BANK: 		'ABANDONED_BY_BANK',
				ABANDONED_BY_GAMBLER: 	'ABANDONED_BY_GAMBLER',
				ABANDONED_BY_TRADER: 	'ABANDONED_BY_TRADER',
				BANKS_AVAILABLE: 		'BANKS_AVAILABLE',
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
		
		_this.servicesSocket 			= undefined;
		_this.authentication 			= Authentication;
		_this.bank 						= {};
		_this.bank.account 				= {};
		_this.service 					= {};
		_this.arrayServices 			= [];
		_this.listServicesInAttention	= {};
		_this.arrayServicesInAttention	= [];
		_this.isWorking 				= false;
		_this.enumUserRole = {
	      ADMIN:    'ADMIN',
	      BANK:     'BANK',
	      TRADER:   'TRADER',
	      GAMBLER:  'GAMBLER'
	    };
	    _this.enumServiceState = {
			CREATED: 				'CREATED',
			COMPLETED: 				'COMPLETED',
			DESISTED: 				'DESISTED',
			ABANDONED_BY_BANK: 		'ABANDONED_BY_BANK',
			ABANDONED_BY_GAMBLER: 	'ABANDONED_BY_GAMBLER',
			ABANDONED_BY_TRADER: 	'ABANDONED_BY_TRADER'
		};

	    _this.fnAddChatMessage = function(serviceId, username, role, message, type) {
	    	var objMessage 	= {};
	    	var service 	= _this.fnGetService(serviceId);

	    	if(service){
				objMessage = {
					username: 	username,
					message:  	message,
					role: 		role,
					type:     	type
				};
				service.listChatMessages.push(objMessage);
			}
	    };

		_this.fnAddServiceInAttention = function(serviceId) {
			_this.arrayServicesInAttention.unshift(serviceId);

			_this.listServicesInAttention[serviceId] = {
				service: 			undefined,
				listChatMessages: 	[],
				isAbandoned:		false,
				isCompleted: 		false,
				isDesisted:			false,
				isDisabled:			false,
				isOpen: 			false
			};
		};

		_this.fnCompleteService = function (serviceId){
			_this.servicesSocket.emit(enumServicesSocketEvent.app.COMPLETE_SERVICE,{
				serviceId: serviceId
			});
		};

	    _this.fnDeleteService = function(serviceId){
			delete _this.listServicesInAttention[serviceId];
		};

		function fnErrorHandling(err) {
			utilSrv.util.notifyError(err.data.message);
		}

		_this.fnGetService = function(serviceId){
			return _this.listServicesInAttention[serviceId];
		};

		_this.fnInitServicesSocket = function(){
			if(!_this.servicesSocket){
				_this.servicesSocket =  new SocketFactory(ApplicationConfiguration.sockets.bankservices);

				_this.fnOnConnectedUser();
				_this.fnOnError();
				_this.fnOnNewMessage();
				_this.fnOnNewService();
				_this.fnOnServiceAbandonedByTrader();
				_this.fnOnServiceCompleted();
				_this.fnOnServiceDesisted();
				_this.fnOnShiftQueue();
				_this.fnOnStopWorking();
			}
		};

		_this.fnLoadListServices = function (){
			return serviceSrv.fnLoadListServicesAttendantUser()
			.then(function(arrayServices){
				_this.arrayServices = arrayServices;
				return _this.arrayServices;
			})
			.catch(fnErrorHandling);
		};

		_this.fnLoadUser = function (){
			return bankSrv.fnRead()
			.then(function(bank){
				_this.bank = bank;
				return _this.bank;
			})
			.catch(fnErrorHandling);
		};

		_this.fnOnServiceAbandonedByTrader = function (callback){
			_this.servicesSocket.on(enumServicesSocketEvent.app.ABANDONED_BY_TRADER, function(data){
	    		var service = _this.fnGetService(data.serviceId);

	    		service.isAbandoned	= true;
	    		service.isDisabled	= true;
	    		service.isOpen 		= false;

	    		_this.fnLoadListServices();

				if(callback){
					callback();
				}
			});
		};

		_this.fnOnConnectedUser = function (callback){
			_this.servicesSocket.on(enumServicesSocketEvent.app.CONNECTED_USER, function(){
				_this.isWorking = false;
				if(callback){
					callback();
				}
			});
		};

		_this.fnOnError = function (){
			_this.servicesSocket.on(enumServicesSocketEvent.app.ERROR, function(data){
				utilSrv.util.notifyError(data.error);
			});
		};

		_this.fnOnNewMessage = function (callback){
			_this.servicesSocket.on(enumServicesSocketEvent.app.NEW_MESSAGE_SERVICE, function(data){
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
			_this.servicesSocket.on(enumServicesSocketEvent.app.NEW_SERVICE, function(data){
				var service;

				_this.fnLoadListServices();
				_this.fnAddServiceInAttention(data.serviceId);

				serviceSrv.fnReadServiceById(data.serviceId)
				.then(function(result){
					service 		= _this.fnGetService(data.serviceId);
					service.service = result;
				})
				.catch(fnErrorHandling);

				if(callback){
					callback();
				}
			});
		};

		_this.fnOnServiceCompleted = function (callback){
			_this.servicesSocket.on(enumServicesSocketEvent.app.SERVICE_COMPLETED, function(data){
				var service = _this.fnGetService(data.serviceId);
				
				_this.fnLoadListServices();
				_this.fnLoadUser();
	    		service.isCompleted	= true;
	    		service.isDisabled	= true;
				service.isOpen 		= false;

				if(callback){
					callback();
				}
			});
		};

		_this.fnOnServiceDesisted = function (callback){
			_this.servicesSocket.on(enumServicesSocketEvent.app.SERVICE_DESISTED, function(data){
				var service = _this.fnGetService(data.serviceId);

				_this.fnLoadListServices();
				service.isDesisted 	= true;
				service.isDisabled 	= true;
				service.isOpen 		= false;

				if(callback){
					callback();
				}
			});
		};

		_this.fnOnShiftQueue = function (callback){
			_this.servicesSocket.on(enumServicesSocketEvent.app.SHIFT_QUEUE, function(data){
				if(callback){
					callback();
				}
			});
		};

		_this.fnOnStopWorking = function (callback){
			_this.servicesSocket.on(enumServicesSocketEvent.app.STOP_WORKING, function(){
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

		_this.fnRemoveService = function (service){
			var index = _this.arrayServicesInAttention.indexOf(service._id);

			if(index >= 0){
				_this.arrayServicesInAttention.splice(index);
				_this.fnDeleteService(service._id);
			}
		};

		_this.fnResetService = function (){
			_this.service = {};
		};

		_this.fnSendMessage = function (serviceId, message, callback){
			_this.servicesSocket.emit(enumServicesSocketEvent.app.NEW_MESSAGE_SERVICE, {
				serviceId: 	serviceId,
				message: 	message
			});

			if(callback){
				callback();
			}
		};

		_this.fnStartWork = function (){
			_this.servicesSocket.emit(enumServicesSocketEvent.app.START_WORK);
			_this.isWorking = true;
		};

		_this.fnStopWorking = function (){
			_this.servicesSocket.emit(enumServicesSocketEvent.app.STOP_WORKING);
			_this.isWorking = false;
		};

		_this.fnInitServicesSocket();
	}
]);