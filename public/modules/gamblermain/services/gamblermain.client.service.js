'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.service(ApplicationConfiguration.services.gamblermain, 
	['$resource', 	 
	 '$q',
	 ApplicationConfiguration.services.authentication, 
	 ApplicationConfiguration.services.account,
	 ApplicationConfiguration.services.service,
	function($resource, $q, Authentication, accountSrv, serviceSrv) {
		var _this 		= this;

		_this.gamblerResource 		= $resource('gamblermain/:gamblerId', {
			gamblerId: '@_id'
		});
		
		_this.authentication 		= Authentication;
		_this.gambler 				= {};
		_this.gambler.account 		= {};
		_this.service 				= {};
		_this.listServices 			= [];
		_this.error 				= '';

		function fnErrorHandling(err) {
			_this.error = err.data.message;
		}
		
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

		_this.fnReadServiceById = function (id){
			return serviceSrv.fnReadServiceById(id)
			.then(function(service){
				_this.service = service;
				return _this.service;
			})
			.catch(fnErrorHandling);
		};

		_this.fnResetService = function (){
			_this.service = {};
		};
		
	}
]);