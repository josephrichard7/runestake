'use strict';

var enumUserrole			= require('../utilities/enums/userrole'),
	enumServicesSocketEvent = require('../utilities/enums/gamesocketevent'),
	gameService 			= require('../services/game'),
	socketService 			= require('../services/socket'),
	GameClass	 			= require('../classes/game'),
	errorUtil 				= require('../utilities/error');

module.exports = GameSocketService;

/*jshint latedef: false */
function GameSocketService(nsp){
	this.nsp 					= nsp;
	this.listConnectedGamblers 	= {};
	this.listCreatedGames 		= {};
	this.listPostedGames 		= {};
	this.numberGames			= 0;

	this.GENERAL_GAME_ROOM = 'GENERAL_GAME_ROOM';
}

/** 
 * Add a gambler to the list of connected gamblers.
 *
 */
GameSocketService.prototype.fnAddConnectedGambler = function(socket){
	this.listConnectedGamblers[socket.username] = {
		user: 		socket.request.user,
		socket: 	socket,
		game: 		undefined,
		postedGame: undefined
	};
};

/** 
 * Add a game created by the trader.
 *
 */
GameSocketService.prototype.fnAddGame = function(gameVO, leftGamblerUsername, rightGamblerUsername, amount){
	var self 					= this;
	var game 	 				= {};
	var connectedLeftGambler 	= {};
	var connectedRightGambler	= {};

	// Get sockets of connected gamblers 
	connectedLeftGambler 	= this.fnGetConnectedGambler(leftGamblerUsername);
	connectedRightGambler 	= this.fnGetConnectedGambler(rightGamblerUsername);

	// Set trader and bank id to the game
	gameVO.leftGambler 	= connectedLeftGambler.user.id;
	gameVO.rightGambler = connectedRightGambler.user.id;
	gameVO.totalAmount	= amount;

	// Create game in DB
	return gameService.fnCreate(gameVO)
	.then(function(gameEntity){
		game = new GameClass(gameEntity._id, connectedLeftGambler.socket, connectedRightGambler.socket, self.nsp);

		self.listGames[game.id] = game;
		self.numberGames++;

		connectedLeftGambler.game 	= game;
		connectedRightGambler.game 	= game;

		return game;
	});
};
