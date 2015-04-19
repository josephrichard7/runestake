'use strict';

angular.module(ApplicationConfiguration.modules.service)
.service(ApplicationConfiguration.services.service, 
	['$resource', 	 
	function($resource) {
		var _this = this;

		_this.serviceResource 		= $resource('service/:serviceId', {
			serviceId: '@_id'
		});

		_this.serviceCancelResource = $resource('service/:serviceId/cancelar',{
			serviceId: '@id'
		},{
			cancel:{
				method: 'PUT'
			}
		});

		_this.fnCancelService = function (id, callback){
			var serviceCancel = new _this.serviceCancelResource();
			
			serviceCancel.id = id;

			serviceCancel.$cancel({
				serviceId: id
			}, function(response) {
				if(callback){
					callback(null, response);
				}
			}, function(errorResponse) {
				if(callback){
					callback(errorResponse.data.message);
				}
			});
		};

		_this.fnCreateService = function (serviceVO, callback){
			var service = new _this.serviceResource(serviceVO);
			
			service.$save(function(response) {
				if(callback){
					callback(null, response);
				}
			}, function(errorResponse) {
				if(callback){
					callback(errorResponse.data.message);
				}
			});
		};

		_this.fnLoadListServices = function (callback){
			_this.serviceResource.query(function(response) {
				if(callback){
					callback(null, response);
				}
			}, function(errorResponse) {
				if(callback){
					callback(errorResponse.data.message);
				}
			});
		};

		_this.fnReadServiceById = function (id, callback){
			_this.serviceResource.get({
				serviceId: id
			},function(response) {
				if(callback){
					callback(null, response);
				}
			}, function(errorResponse) {
				if(callback){
					callback(errorResponse.data.message);
				}
			});
		};
		
	}
]);