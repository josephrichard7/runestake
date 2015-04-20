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

		_this.fnCancelService = function (id){
			var serviceCancel = new _this.serviceCancelResource();
			
			serviceCancel.id = id;

			return serviceCancel.$cancel({
				serviceId: id
			});
		};

		_this.fnCreateService = function (serviceVO){
			var service = new _this.serviceResource(serviceVO);
			
			return service.$save();
		};

		_this.fnLoadListServices = function (){
			return _this.serviceResource.query().$promise;
		};

		_this.fnReadServiceById = function (id){
			return _this.serviceResource.get({
				serviceId: id
			}).$promise;
		};
		
	}
]);