'use strict';

//Menu service used for managing  menus
angular.module(ApplicationConfiguration.applicationModuleName).service('Utilities', ['$resource',
	function($resource){
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
	}
]);