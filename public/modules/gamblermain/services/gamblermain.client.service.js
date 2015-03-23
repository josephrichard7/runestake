'use strict';

//Gamblermain service used for communicating with the Gamblermain REST endpoints
angular.module('gamblermain').factory('Gamblermain', ['$resource',
	function($resource) {
		// return $resource('trader/:traderId', {
		// 	traderId: '@_id'
		// }, {
		// 	update: {
		// 		method: 'PUT'
		// 	}
		// });
	}
]);