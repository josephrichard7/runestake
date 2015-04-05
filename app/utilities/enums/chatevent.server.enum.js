'use strict';

var EnumChatEvent = {
	// Native events
	CONNECTION: 	'connect',
	DISCONNECT:		'disconnect',
	// App events
	LOGIN: 			'LOGIN',
	NEW_USER: 		'NEW_USER',
	NEW_MESSAGE: 	'NEW_MESSAGE',
	USER_JOINED: 	'USER_JOINED',
	USER_LEFT: 		'USER_LEFT'
};

module.exports = EnumChatEvent;