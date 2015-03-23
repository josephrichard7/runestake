'use strict';

//Menu service used for managing  menus
angular.module('util').service('Utilities', ['$resource',
	function($resource){

		this.enumResource = $resource('enum/:enumName');
	}
]);