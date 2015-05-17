'use strict';

angular.module(ApplicationConfiguration.modules.service)
.service(ApplicationConfiguration.services.service, 
	['$resource', 	 
	function($resource) {
		var _this = this;

		var ServiceResource 		= $resource('service/:serviceId', {
			serviceId: '@_id'
		});

		var ServiceCancelResource = $resource('service/:serviceId/cancelar',{
			serviceId: '@id'
		},{
			cancel:{
				method: 'PUT'
			}
		});

		var ServiceDesistResource = $resource('service/:serviceId/desist',{
			serviceId: '@id'
		},{
			desist:{
				method: 'PUT'
			}
		});

		var ListServiceRequestingUserResource = $resource('service/listrequestinguser');
		var ListServiceAttendantUserResource = $resource('service/listattendantuser');

		_this.fnCancelService = function (id){
			var serviceCancel = new ServiceCancelResource();
			
			serviceCancel.id = id;

			return serviceCancel.$cancel({
				serviceId: id
			});
		};

		_this.fnDesistService = function (id){
			var serviceDesist = new ServiceDesistResource();
			
			serviceDesist.id = id;

			return serviceDesist.$desist({
				serviceId: id
			});
		};

		_this.fnLoadListServices = function (){
			return ListServiceRequestingUserResource.query().$promise;
		};

		_this.fnLoadListServicesAttendantUser = function (){
			return ListServiceAttendantUserResource.query().$promise;
		};

		_this.fnReadServiceById = function (id){
			return ServiceResource.get({
				serviceId: id
			}).$promise;
		};
		
	}
]);