'use strict';

var EnumChatEvent = {
	// Native events
	natives: {
		CONNECTION: 	'connect',
		DISCONNECT:		'disconnect',	
	},
	// App events
	app: {		
		LOGIN: 			'LOGIN',
		NEW_USER: 		'NEW_USER',
		NEW_MESSAGE: 	'NEW_MESSAGE',
		USER_JOINED: 	'USER_JOINED',
		USER_LEFT: 		'USER_LEFT'
	}
};

module.exports = EnumChatEvent;