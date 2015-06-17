'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.service(ApplicationConfiguration.services.stakemain, [
	ApplicationConfiguration.services.authentication, 
	ApplicationConfiguration.services.gambler,
	ApplicationConfiguration.services.stake,
	ApplicationConfiguration.factories.socket,
  	ApplicationConfiguration.factories.stakegame,
  	ApplicationConfiguration.services.utilities,
	function(Authentication, gamblerSrv, stakeSrv, SocketFactory, StakegameFactory, utilSrv) {
		var _this = this;

		var enumStakeSocketEvent = {
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
		
		_this.stakeSocket 			= undefined;
		_this.authentication 		= Authentication;
		_this.gambler 				= {};
		_this.gambler.account 		= {};
		_this.listPostedStake 		= {};
		_this.arrayPostedStake 		= [];
		_this.stake 				= {};
		_this.stake.arrayMessages	= undefined;
		_this.stakeGame 			= undefined;

		_this.fnAcceptStake = function(stake) {
			_this.stakeSocket.emit(enumStakeSocketEvent.app.ACCEPT_STAKE, {
				username: 		stake.username,
				stakeAmount: 	stake.stakeAmount
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
			_this.stake.arrayMessages.push(objMessage);
	    };

	    _this.fnAddPostStake = function(stake) {
			_this.arrayPostedStake.unshift(stake);

			_this.listPostedStake[stake.username] = stake;
	    };

	    _this.fnDeletePostStake = function (stake){
			var index = _this.arrayPostedStake.indexOf(stake.leftGambler.username);

			if(index >= 0){
				_this.arrayPostedStake.splice(index);
				delete _this.listPostedStake[stake.leftGambler.username];
			}
		};

		function fnErrorHandling(err) {
			utilSrv.util.notifyError(err.data.message);
		}

		_this.fnFinishStake = function (stake) {
			utilSrv.util.go('gamblermainState.stake.finish',{
				id: stake.id
			});
		};

		_this.fnGamblerClicked = function (){
			_this.stakeSocket.emit(enumStakeSocketEvent.app.GAMBLER_CLICKED);
		};

		_this.fnGamblerHit = function (stakeHit){
			_this.stakeGame.fnHit(stakeHit);
		};

		_this.fnGamblerReady = function (){
			_this.stakeSocket.emit(enumStakeSocketEvent.app.GAMBLER_READY);
		};

		_this.fnInitStakeSocket = function(){
			if(!_this.stakeSocket){
				_this.stakeSocket 	= new SocketFactory(ApplicationConfiguration.sockets.stake);

				_this.fnOnConnectedUser();
				_this.fnOnGamblerHit();
				_this.fnOnError();
				_this.fnOnStakeCreated();
				_this.fnOnStakeFinished();
				_this.fnOnStakeNotFound();
				_this.fnOnNewChatMessage();
				_this.fnOnPostStake();
				_this.fnOnRemovePostedStake();
			}
		};

		_this.fnOnConnectedUser = function (callback){
			_this.stakeSocket.on(enumStakeSocketEvent.app.CONNECTED_USER, function(data){
				_this.listPostedStake = data.listPostedStake;
				if(callback){
					callback();
				}
			});
		};

		_this.fnOnGamblerHit = function (){
			_this.stakeSocket.on(enumStakeSocketEvent.app.GAMBLER_HIT, function(data){
				_this.fnGamblerHit(data.stakeHit);
			});
		};

		_this.fnOnError = function (){
			_this.stakeSocket.on(enumStakeSocketEvent.app.ERROR, function(data){
				utilSrv.util.notifyError(data.error);
			});
		};

		_this.fnOnStakeCreated = function (){
			_this.stakeSocket.on(enumStakeSocketEvent.app.STAKE_CREATED, function(data){
				utilSrv.util.go('gamblermainState.stake.play', {
					id: data.stakeId
				});
			});
		};

		_this.fnOnStakeFinished = function (){
			_this.stakeSocket.on(enumStakeSocketEvent.app.STAKE_FINISHED, function(data){
				_this.fnFinishStake(data);
			});
		};

		_this.fnOnStakeNotFound = function (){
			_this.stakeSocket.on(enumStakeSocketEvent.app.STAKE_NOTFOUND, function(data){
				utilSrv.util.notifyError(data.message);
			});
		};

		_this.fnOnNewChatMessage = function (callback){
			_this.stakeSocket.on(enumStakeSocketEvent.app.NEW_CHAT_MESSAGE, function(data){
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

		_this.fnOnPostStake = function (callback){
			_this.stakeSocket.on(enumStakeSocketEvent.app.POST_STAKE, function(data){
				_this.fnAddPostStake(data.stake);
				if(data.stake.username === Authentication.user.username){
					utilSrv.util.notify('You have posted a Stake.');
				}
		    	if(callback){
		    		callback();
		    	}
			});
		};

		_this.fnOnRemovePostedStake = function (callback){
			_this.stakeSocket.on(enumStakeSocketEvent.app.REMOVE_POSTED_STAKE, function(data){
				delete _this.listPostedStake[data.gamblerUsername];
				if(data.gamblerUsername === Authentication.user.username){
					utilSrv.util.notify('Your posted Stake has been removed.');
				}
		    	if(callback){
		    		callback();
		    	}
			});
		};

		_this.fnPostStake = function (stakeAmount){
			_this.stakeSocket.emit(enumStakeSocketEvent.app.POST_STAKE, {
				stakeAmount: stakeAmount
			});
		};

		_this.fnReadStakeById = function (id){
			return stakeSrv.fnReadById(id)
			.then(function(stake){
				if(_this.stake.arrayMessages){
					stake.arrayMessages = _this.stake.arrayMessages;
				}else{
					stake.arrayMessages = [];
				}
				_this.stake = stake;
				return _this.stake;
			})
			.catch(fnErrorHandling);
		};

		_this.fnRemovePostedStake = function() {
			_this.stakeSocket.emit(enumStakeSocketEvent.app.REMOVE_POSTED_STAKE);
	    };	    

		_this.fnResetStake = function (){
			_this.stake 				= {};
			_this.stake.arrayMessages 	= undefined;
		};

		_this.fnSendMessage = function (callback){
			_this.stakeSocket.emit(enumStakeSocketEvent.app.NEW_CHAT_MESSAGE, {
				stakeId: 	_this.stake._id,
				message: 	_this.stake.message
			});
			_this.stake.message = '';
			if(callback){
				callback();
			}
		};

		_this.fnStartStake = function (stakeId){
			return _this.fnReadStakeById(stakeId)
			.then(function(stake){
				_this.stakeGame = new StakegameFactory(_this);
			});
		};

	}
]);