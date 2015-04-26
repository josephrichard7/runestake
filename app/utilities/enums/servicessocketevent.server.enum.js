'use strict';

var EnumServicesSocketEvent = {
	// Native events
	natives: {
		CONNECTION: 	'connect',
		DISCONNECT:		'disconnect',	
	},
	// App events
	app: {
		CONNECTED_USER: 	'CONNECTED_USER',
		TRADERS_AVAILABLE: 	'TRADERS_AVAILABLE',
		START_WORK: 		'START_WORK',
		SHIFT_QUEUE: 		'SHIFT_QUEUE',
		STOP_WORKING: 		'STOP_WORKING',
		REQUEST_TRADER: 	'REQUEST_TRADER',
		TRADER_ASSIGNED: 	'TRADER_ASSIGNED ',
		NEW_SERVICE: 		'NEW_SERVICE',
		NEW_MESSAGE_SERVICE:'NEW_MESSAGE_SERVICE',
		SERVICE_FINISHED: 	'SERVICE_FINISHED',
		ERROR: 				'ERROR'
	}
};

module.exports = EnumServicesSocketEvent;