'use strict';

var EnumGameSocketEvent = {
	// Native events
	natives: {
		CONNECTION: 	'connect',
		DISCONNECT:		'disconnect',	
	},
	// App events
	app: {
		ACCEPT_CHALLENGE: 		'ACCEPT_CHALLENGE',
		CHALLENGE_GAMBLER: 		'CHALLENGE_GAMBLER',
		CONNECTED_USER: 		'CONNECTED_USER',
		DELETE_BET: 			'DELETE_BET',
		ERROR: 					'ERROR',
		GAMBLER_FIGHT: 			'GAMBLER_FIGHT',
		GAMBLER_READY: 			'GAMBLER_READY',
		GAME_CREATED: 			'GAME_CREATED',
		GAME_FINISHED: 			'GAME_FINISHED',
		POST_BET: 				'POST_BET',
		NEW_CHAT_MESSAGE:		'NEW_CHAT_MESSAGE',
		NOTFOUND_BET: 			'NOTFOUND_BET',
		REJECT_CHALLENGE: 		'REJECT_CHALLENGE',
		START_GAME: 			'START_GAME'
	}
};

module.exports = EnumGameSocketEvent;