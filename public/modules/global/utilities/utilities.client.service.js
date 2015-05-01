'use strict';

angular.module(ApplicationConfiguration.modules.global)
.service(ApplicationConfiguration.services.utilities, 
	['$resource',
	 '$location',
	 '$state',
	function($resource, $location, $state){
		var defaultOptionsGoFunction = {
			location: 	false,
			inherit: 	false,
			reload: 	true
		};
		this.util = {};

		this.enumName = {
			TRADERRANK: 'traderrank',
			USERSTATE: 	'userstate',
			CHATEVENT: 	'chatevent'
		};
		this.enumType = {
			ARRAY: 	'ARRAY',
			OBJECT: 'OBJECT'
		};

		this.enumResource = $resource('enum/:name/:type');

		this.util.go = function(state, params, options){
			$state.go(state, params, options || defaultOptionsGoFunction);
		};
	}
]);