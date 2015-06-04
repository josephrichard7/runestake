'use strict';

var EnumStakeSocketEvent = {
	// Native events
	natives: {
		CONNECTION: 	'connect',
		DISCONNECT:		'disconnect',	
	},
	// App events
	app: {
		ACCEPT_STAKE: 		'ACCEPT_STAKE',
		CONNECTED_USER: 	'CONNECTED_USER',
		REMOVE_POSTED_STAKE:'REMOVE_POSTED_STAKE',
		ERROR: 				'ERROR',
		GAMBLER_CLICKED: 	'GAMBLER_CLICKED',
		GAMBLER_HIT: 		'GAMBLER_HIT',
		GAMBLER_READY: 		'GAMBLER_READY',
		STAKE_CREATED: 		'STAKE_CREATED',
		STAKE_FINISHED: 	'STAKE_FINISHED',
		NEW_CHAT_MESSAGE:	'NEW_CHAT_MESSAGE',
		STAKE_NOTFOUND: 	'STAKE_NOTFOUND',
		POST_STAKE: 		'POST_STAKE'
	}
};

module.exports = EnumStakeSocketEvent;