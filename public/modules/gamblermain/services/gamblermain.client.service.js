'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.service(ApplicationConfiguration.services.gamblermain, 
	['$resource', 	 
	 ApplicationConfiguration.services.authentication, 
	 ApplicationConfiguration.services.account,
	 ApplicationConfiguration.services.service,
	function($resource, Authentication, accountSrv, serviceSrv) {
		var _this = this;

		_this.gamblerResource 		= $resource('gamblermain/:gamblerId', {
			gamblerId: '@_id'
		});

		_this.authentication 		= Authentication;
		_this.gambler 				= {};
		_this.gambler.account 		= {};
		_this.service 				= {};
		_this.listServices 			= [];
		
		_this.fnCancelService = function (callback){
			serviceSrv.fnCancelService(_this.service._id, function(err, service) {
				if(callback){
					if(err){
						callback(err);						
					}else{
						callback(null, service);						
					}
				}
			});
		};

		_this.fnCreateService = function (callback){
			serviceSrv.fnCreateService(_this.service, function(err, service){
				_this.service = service;
				if(callback){
					if(err){
						callback(err);						
					}else{
						callback(null, service);						
					}
				}
			});
		};

		_this.fnLoadListServices = function (callback){
			serviceSrv.fnLoadListServices(function(err, listServices){
				_this.listServices = listServices;
				if(callback){
					if(err){
						callback(err);						
					}else{
						callback(null, listServices);						
					}
				}
			});
		};

		_this.fnLoadUser = function (){
			_this.gamblerResource.get({
				gamblerId: _this.authentication.user._id
			},function(gambler){
				_this.gambler = gambler;

				accountSrv.get({
					userId: _this.gambler._id
				},function(account){
					_this.gambler.account = account;
				});
			});
		};

		_this.fnReadServiceById = function (id, callback){
			serviceSrv.fnReadServiceById(id, function(err, service){
				_this.service = service;
				if(callback){
					if(err){
						callback(err);						
					}else{
						callback(null, service);
					}
				}
			});
		};

		_this.fnResetService = function (){
			_this.service = {};
		};
		
	}
]);