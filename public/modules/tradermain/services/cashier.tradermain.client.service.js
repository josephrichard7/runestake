'use strict';

angular.module(ApplicationConfiguration.modules.tradermain)
.service(ApplicationConfiguration.services.cashiertradermain, [
	ApplicationConfiguration.services.authentication, 
	ApplicationConfiguration.services.trader,
	ApplicationConfiguration.services.service,
	ApplicationConfiguration.factories.chat,	 
  	ApplicationConfiguration.services.utilities,
	function(Authentication, traderSrv, serviceSrv, ChatFactory, utilSrv) {
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
		
		_this.servicesSocket 		= undefined;
		_this.authentication 		= Authentication;
		_this.trader 				= {};
		_this.trader.account 		= {};
		_this.service 				= {};
		_this.service.listMessages	= [];
		_this.listServices 			= [];
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
			ABANDONED_BY_BANK: 		'ABANDONED_BY_BANK',
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
			_this.service.listMessages.push(objMessage);
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
			// _this.error = err.data.message;
			utilSrv.util.notifyError(err.data.message);
		}

		_this.fnInitServicesSocket = function(){
			if(!_this.servicesSocket){
				_this.servicesSocket =  new ChatFactory(ApplicationConfiguration.sockets.bankservices);

				_this.fnOnConnectedUser();
				_this.fnOnError();
	      		_this.fnOnNewMessage();
	      		_this.fnOnServiceAbandonedByBank();
				_this.fnOnServiceCreated();
				_this.fnOnServiceDesisted();
				_this.fnOnServiceCompleted();
				_this.fnOnBanksAvailable();
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
			traderSrv.fnReadById(_this.authentication.user._id)
			.then(function(trader){
				_this.trader = trader;
				return _this.trader;
			})
			.catch(fnErrorHandling);
		};

		_this.fnOnBanksAvailable = function (){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.BANKS_AVAILABLE, function(data){
				if(data.isBanksAvailable){
					utilSrv.util.notify(data.message);
				}else{
					utilSrv.util.notifyError(data.message);
				}
			});
		};

		_this.fnOnConnectedUser = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.CONNECTED_USER, function(){
				if(callback){
					callback();
				}
			});
		};

		_this.fnOnError = function (){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.ERROR, function(data){
				utilSrv.util.notifyError(data.error);
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

		_this.fnOnServiceAbandonedByBank = function (callback){
			_this.servicesSocket.socket.on(enumServicesSocketEvent.app.ABANDONED_BY_BANK, function(data){
				utilSrv.util.go('tradermainState.cashier.srvstate',{
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
				utilSrv.util.go('tradermainState.cashier.srvcreated',{
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
		        utilSrv.util.go('tradermainState.cashier.srvstate',{
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
				_this.fnLoadUser();
		        utilSrv.util.go('tradermainState.cashier.srvstate',{
		        	id: data.serviceId
		        });

				if(callback){
					callback();
				}
			});
		};

		_this.fnReadServiceById = function (id){
			return serviceSrv.fnReadServiceById(id)
			.then(function(service){
				if(_this.service.listMessages){
					service.listMessages = _this.service.listMessages;
				}else{
					service.listMessages = [];
				}
				_this.service = service;
				return _this.service;
			})
			.catch(fnErrorHandling);
		};

		_this.fnResetService = function (){
			_this.service = {};
			_this.service.listMessages = [];
		};

		_this.fnSendMessage = function (callback){
			_this.servicesSocket.socket.emit(enumServicesSocketEvent.app.NEW_MESSAGE_SERVICE, {
				serviceId: 	_this.service._id,
				message: 	_this.service.message
			});
			_this.service.message = '';
			if(callback){
				callback();
			}
		};

		_this.fnBanksAvailable = function (){
			_this.servicesSocket.socket.emit(enumServicesSocketEvent.app.BANKS_AVAILABLE);
		};
	}
]);