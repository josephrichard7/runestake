'use strict';

angular.module(ApplicationConfiguration.modules.stake)
.service(ApplicationConfiguration.services.stake, [
	'$resource',
	function($resource) {
		var _this = this;

		var StakeResource = $resource('stake/:id');

		_this.fnReadById = function(id){
			return StakeResource.get({
				id: id
			}).$promise;
		};
	}
]);