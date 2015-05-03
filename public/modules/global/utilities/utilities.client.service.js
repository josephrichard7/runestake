'use strict';

angular.module(ApplicationConfiguration.modules.global)
.service(ApplicationConfiguration.services.utilities, [
	'$resource',
	'$state',
	function($resource, $state){
		var _this = this;
		var enumResource = $resource('enum/:name/:type');
		var enumType = {
			ARRAY: 	'ARRAY',
			OBJECT: 'OBJECT'
		};
		var defaultOptionsGoFunction = {
			location: 	false,
			inherit: 	false,
			reload: 	true
		};

		_this.util = {};

		_this.enumName = {
			CHATEVENT: 				'chatevent',
			SERVICESSOCKETEVENT: 	'servicessocketevent',
			SERVICESTATE: 			'servicestate',
			TRADERRANK: 			'traderrank',
			USERROLE: 				'userrole',
			USERSTATE: 				'userstate'
		};

		_this.util.fnLoadEnumArray = function(enumName){
			return enumResource.get({
				name: enumName, 
				type: enumType.ARRAY
			}).$promise;
		};

		_this.util.fnLoadEnumObject = function(enumName){
			return enumResource.get({
				name: enumName, 
				type: enumType.OBJECT
			}).$promise;
		};

		_this.util.go = function(state, params, options){
			$state.go(state, params, options || defaultOptionsGoFunction);
		};
	}
]);