'use strict';

//Trader service used for communicating with the trader REST endpoints
angular.module(ApplicationConfiguration.modules.trader)
.factory(ApplicationConfiguration.services.trader, 
	['$resource',
	function($resource) {
		return $resource('trader/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);