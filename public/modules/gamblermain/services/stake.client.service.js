'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.service(ApplicationConfiguration.services.stake, [
	ApplicationConfiguration.services.authentication, 
	ApplicationConfiguration.services.gambler,
	ApplicationConfiguration.services.game,
	ApplicationConfiguration.factories.socket,
  	ApplicationConfiguration.services.utilities,
	function(Authentication, gamblerSrv, gameSrv, SocketFactory, utilSrv) {
		var _this = this;

		var enumGameSocketEvent = {
			// Native events
			natives: {
				CONNECTION: 	'connect',
				DISCONNECT:		'disconnect',	
			},
			// App events
			app: {
				ACCEPT_BET: 			'ACCEPT_BET',
				CONNECTED_USER: 		'CONNECTED_USER',
				DELETE_BET: 			'DELETE_BET',
				ERROR: 					'ERROR',
				GAMBLER_FIGHT: 			'GAMBLER_FIGHT',
				GAMBLER_READY: 			'GAMBLER_READY',
				GAME_CREATED: 			'GAME_CREATED',
				GAME_FINISHED: 			'GAME_FINISHED',
				POST_BET: 				'POST_BET',
				NEW_CHAT_MESSAGE:		'NEW_CHAT_MESSAGE',
				NEW_POSTED_BET: 		'NEW_POSTED_BET',
				NOTFOUND_BET: 			'NOTFOUND_BET',
				REJECT_CHALLENGE: 		'REJECT_CHALLENGE',
				START_GAME: 			'START_GAME'
			}
		};
		
		_this.gameSocket 			= undefined;
		_this.authentication 		= Authentication;
		_this.gambler 				= {};
		_this.gambler.account 		= {};
		_this.listPostedBet 		= {};
		_this.arrayPostedBet 		= [];
		_this.game 					= {};
		_this.game.arrayMessages	= [];
		_this.enumUserRole   		= {
	      ADMIN:    'ADMIN',
	      BANK:     'BANK',
	      TRADER:   'TRADER',
	      GAMBLER:  'GAMBLER'
	    };
	    _this.enumGameState = {
			STARTED: 	'STARTED',
			FINISHED: 	'FINISHED'
		};

		_this.fnAcceptBet = function(game) {
			_this.gameSocket.emit(enumGameSocketEvent.app.ACCEPT_BET, {
				username: 	game.leftGambler.username,
				betAmount: 	game.betAmount
			});
	    };

	    // Add chat message to list
	    _this.fnAddChatMessage = function(username, role, message, type) {
			var objMessage = {
				username: 	username,
				message:  	message,
				role: 		role,
				type:     	type
			};
			_this.game.arrayMessages.push(objMessage);
	    };

	    _this.fnAddPostedBet = function(game) {
			_this.arrayPostedBet.unshift(game);

			_this.listPostedBet[game.leftGambler.username] = game;
	    };

	    _this.fnDeletePostedBet = function (game){
			var index = _this.arrayPostedBet.indexOf(game.leftGambler.username);

			if(index >= 0){
				_this.arrayPostedBet.splice(index);
				delete _this.listPostedBet[game.leftGambler.username];
			}
		};

		function fnErrorHandling(err) {
			utilSrv.util.notifyError(err.data.message);
		}

		_this.fnInitServicesSocket = function(){
			if(!_this.gameSocket){
				_this.gameSocket =  new SocketFactory(ApplicationConfiguration.sockets.game);

				_this.fnOnConnectedUser();
				_this.fnOnError();
	      		_this.fnOnNewMessage();
	      		_this.fnNewPostedGame();
	   //    		_this.fnOnGameStart();
				// _this.fnOnGameMatched();
				// _this.fnOnGameFinish();
			}
		};

		_this.fnPostBet = function (betAmount){
			_this.gameSocket.emit(enumGameSocketEvent.app.POST_BET, {
				betAmount: betAmount
			});
		};

		_this.fnOnConnectedUser = function (callback){
			_this.gameSocket.on(enumGameSocketEvent.app.CONNECTED_USER, function(){
				if(callback){
					callback();
				}
			});
		};

		_this.fnOnDeleteBet = function (){
			_this.gameSocket.on(enumGameSocketEvent.app.DELETE_BET, function(data){
				_this.fnDeletePostedBet(data);
			});
		};

		_this.fnOnError = function (){
			_this.gameSocket.on(enumGameSocketEvent.app.ERROR, function(data){
				utilSrv.util.notifyError(data.error);
			});
		};

		_this.fnOnGameCreated = function (){
			_this.gameSocket.on(enumGameSocketEvent.app.GAME_CREATED, function(data){
				_this.fnStartGame(data);
			});
		};

		_this.fnOnNewChatMessage = function (callback){
			_this.gameSocket.on(enumGameSocketEvent.app.NEW_CHAT_MESSAGE, function(data){
				_this.fnAddChatMessage(
					data.username,
					data.role,
					data.message,
					''
				);
		    	if(callback){
		    		callback();
		    	}
			});
		};

		_this.fnOnNewPostedBet = function (callback){
			_this.gameSocket.on(enumGameSocketEvent.app.NEW_POSTED_BET, function(data){
				_this.fnAddPostedBet(data);
		    	if(callback){
		    		callback();
		    	}
			});
		};

		_this.fnReadGameById = function (id){
			return gameSrv.fnReadGameById(id)
			.then(function(game){
				if(_this.game.arrayMessages){
					game.arrayMessages = _this.game.arrayMessages;
				}else{
					game.arrayMessages = [];
				}
				_this.game = game;
				return _this.game;
			})
			.catch(fnErrorHandling);
		};

		_this.fnResetGame = function (){
			_this.game = {};
			_this.game.arrayMessages = [];
		};

		_this.fnSendMessage = function (callback){
			_this.gameSocket.emit(enumGameSocketEvent.app.NEW_CHAT_MESSAGE, {
				gameId: 	_this.game._id,
				message: 	_this.game.message
			});
			_this.game.message = '';
			if(callback){
				callback();
			}
		};
	}
]);