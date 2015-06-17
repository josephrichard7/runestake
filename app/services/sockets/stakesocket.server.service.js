'use strict';

var enumUserrole			= require('../../utilities/enums/userrole'),
	enumStakeSocketEvent 	= require('../../utilities/enums/stakesocketevent'),
	accountService 			= require('../../services/account'),
	stakeService 			= require('../../services/stake'),
	socketService 			= require('../../services/sockets/socket'),
	StakeClass	 			= require('../../classes/stake'),
	errorUtil 				= require('../../utilities/error');

module.exports = StakeSocketService;

/*jshint latedef: false */
function StakeSocketService(nsp){
	this.nsp 					= nsp;
	this.listConnectedGambler 	= {};
	this.listCreatedStake 		= {};
	this.listPostedStake 		= {};
	this.numberStakes			= 0;

	this.GENERAL_GAME_ROOM = 'GENERAL_GAME_ROOM';
}

/** 
 * Add a gambler to the list of connected gamblers.
 *
 */
StakeSocketService.prototype.fnAddConnectedGambler = function(socket){
	this.listConnectedGambler[socket.username] = {
		user: 			socket.request.user,
		socket: 		socket,
		stake: 			undefined
	};
};

/** 
 * Add posted stake
 *
 */
StakeSocketService.prototype.fnAddPostedStake = function(connectedGambler, stakeAmount){
	var stake = {
		username: 		connectedGambler.user.username,
		stakeAmount: 	stakeAmount,
		date: 			Date.now()
	};

	this.listPostedStake[connectedGambler.user.username] = stake;
	socketService.fnEmitToAll(this.nsp, enumStakeSocketEvent.app.POST_STAKE, {
		stake: stake
	});
	// this.fnSendInfoMessage('You have posted a Stake.');
};

/** 
 * Add a stake created by the trader.
 *
 */
StakeSocketService.prototype.fnAddStake = function(leftGamblerUsername, rightGamblerUsername, amount){
	var self 					= this;
	var stake 	 				= {};
	var connectedLeftGambler 	= {};
	var connectedRightGambler	= {};
	var stakeVO 				= {};

	// Get sockets of connected gamblers 
	connectedLeftGambler 	= this.fnGetConnectedGambler(leftGamblerUsername);
	connectedRightGambler 	= this.fnGetConnectedGambler(rightGamblerUsername);

	// Set trader and bank id to the stake
	stakeVO.leftGambler 	= connectedLeftGambler.user.id;
	stakeVO.rightGambler 	= connectedRightGambler.user.id;
	stakeVO.totalAmount		= amount;

	// Create stake in DB
	return stakeService.fnCreate(stakeVO)
	.then(function(stakeEntity){
		stake = new StakeClass(stakeEntity._id, connectedLeftGambler.socket, connectedRightGambler.socket, self.nsp);

		stake.fnGenerateStake();
		
		self.listCreatedStake[stake.id] = stake;
		self.numberStakes++;

		connectedLeftGambler.stake 	= stake;
		connectedRightGambler.stake = stake;

		return stake;
	});
};

/** 
 * Delete connected gambler
 *
 * @param {String} gamblerUsername
 */
StakeSocketService.prototype.fnDeleteConnectedGambler = function (gamblerUsername){
	var connectedGambler 	= this.fnGetConnectedGambler(gamblerUsername);
	if (connectedGambler) {
		delete this.listConnectedGambler[gamblerUsername];
	}
};

/** 
 * Get connected gambler
 *
 * @param {String} gamblerUsername
 */
StakeSocketService.prototype.fnGetConnectedGambler = function (gamblerUsername){
	return this.listConnectedGambler[gamblerUsername];
};

/** 
 * Get posted stake
 *
 * @param {String} gamblerUsername
 */
StakeSocketService.prototype.fnGetPostedStake = function (gamblerUsername){
	return this.listPostedStake[gamblerUsername];
};

/** 
 * Get created stake
 *
 * @param {String} id
 */
StakeSocketService.prototype.fnGetCreatedStake = function (id){
	return this.listCreatedStake[id];
};

/** 
 * Called when gambler Accept a posted stake.
 *
 * @param socket
 */
StakeSocketService.prototype.fnOnAcceptStake = function (socket){
	var self = this;

	return function(data){
		self.fnVerifyAccountBalance(socket.username, data.stakeAmount)
		.then(function(valid){
			if(valid){
				self.fnAddStake(data.username, socket.username, data.stakeAmount);
			}
		});
	};
};

/** 
 * Connects a new gambler.
 *
 */
StakeSocketService.prototype.fnOnConnectGambler = function(socket){
	var connectedGambler;

	socket.username  = socket.request.user.username;
	connectedGambler = this.fnGetConnectedGambler(socket.username);

	if(connectedGambler){
		connectedGambler.socket = socket;
	}else{
		this.fnAddConnectedGambler(socket);
	}

	// Event handlers
	socket.on(enumStakeSocketEvent.app.ACCEPT_STAKE,		this.fnOnAcceptStake(socket));
	socket.on(enumStakeSocketEvent.app.GAMBLER_CLICKED,		this.fnOnGamblerClicked(socket));
	socket.on(enumStakeSocketEvent.app.GAMBLER_READY, 		this.fnOnGamblerReady(socket));
	socket.on(enumStakeSocketEvent.app.NEW_CHAT_MESSAGE, 	this.fnOnNewChatMessage(socket));
	socket.on(enumStakeSocketEvent.app.POST_STAKE, 			this.fnOnPostStake(socket));
	socket.on(enumStakeSocketEvent.app.REMOVE_POSTED_STAKE, this.fnOnRemovePostedStake(socket));
	socket.on(enumStakeSocketEvent.natives.DISCONNECT, 		this.fnOnDisconnectGambler(socket));

	socketService.fnEmitToMe(socket, enumStakeSocketEvent.app.CONNECTED_USER, {
		listPostedStake: this.listPostedStake
	});
};

/** 
 * Disconnect gambler.
 *
 * @param socket
 */
StakeSocketService.prototype.fnOnDisconnectGambler = function (socket){
	var self = this;

	return function(){
		// If Gambler has posted a stake, remove it.
		self.fnRemovePostedStake(socket.username);

		// Delete connected gambler
		self.fnDeleteConnectedGambler(socket.username);
	};
};

/** 
 * Called when is just going to start the stake and gambler clic to hit first
 *
 * @param {Object} {stakeId}
 */
StakeSocketService.prototype.fnOnGamblerClicked = function(socket){
	var self = this;
	return function (){
		var connectedGambler 	= self.fnGetConnectedGambler(socket.username);
		var stake 				= self.fnGetCreatedStake(connectedGambler.stake.id);

		if(connectedGambler.user.username === stake.leftGamblerSocket.username){
			stake.fnLeftGamblerClicked();
		}else if(connectedGambler.user.username === stake.rightGamblerSocket.username){
			stake.fnRightGamblerClicked();
		}
	};
};

/** 
 * Called when gambler environment for the stake is ready.
 *
 * @param {Object} {stakeId}
 */
StakeSocketService.prototype.fnOnGamblerReady = function(socket){
	var self = this;
	return function (){
		var connectedGambler 	= self.fnGetConnectedGambler(socket.username);
		var stake 				= self.fnGetCreatedStake(connectedGambler.stake.id);

		if(connectedGambler.user.username === stake.leftGamblerSocket.username){
			stake.fnLeftGamblerReady();
		}else if(connectedGambler.user.username === stake.rightGamblerSocket.username){
			stake.fnRightGamblerReady();
		}
	};
};

/** 
 * Called when gambler send chat message while is staking.
 *
 * @param {Object} {stakeId, message}
 */
StakeSocketService.prototype.fnOnNewChatMessage = function(socket){
	var self = this;
	return function (data){
		var stake = self.fnGetCreatedStake(data.stakeId);

		stake.fnNewChatMessage(socket, data.message);
	};
};

/** 
 * Called when gambler posts a stake
 *
 */
StakeSocketService.prototype.fnOnPostStake = function(socket){
	var self = this;
	return function(data){
		var connectedGambler 	= self.fnGetConnectedGambler(socket.username);
	
		if(!data.stakeAmount || data.stakeAmount <= 0){
			self.fnSendError(socket, 'Stake amount must be greater than 0.');
			return;
		}

		self.fnVerifyAccountBalance(connectedGambler.user.username, data.stakeAmount)
		.then(function(valid){
			if(valid){
				self.fnAddPostedStake(connectedGambler, data.stakeAmount);
			}
		});
	};
};

/** 
 * Called when gambler removes his posted stake
 *
 */
StakeSocketService.prototype.fnOnRemovePostedStake = function(socket){
	var self = this;
	return function(){
		var connectedGambler 	= self.fnGetConnectedGambler(socket.username);
		var postedStake 		= self.fnGetPostedStake(socket.username);
	
		if(postedStake && connectedGambler){
			// self.fnSendInfoMessage('You have deleted your posted Stake.');
			self.fnRemovePostedStake(connectedGambler.user.username);
		}
	};
};

/** 
 * Remove posted stake
 *
 * @param {String} gamblerUsername
 */
StakeSocketService.prototype.fnRemovePostedStake = function (gamblerUsername){
	var postedStake = this.fnGetPostedStake(gamblerUsername);

	if(postedStake){
		delete this.listPostedStake[gamblerUsername];
		socketService.fnEmitToAll(this.nsp, enumStakeSocketEvent.app.REMOVE_POSTED_STAKE, {
			gamblerUsername: gamblerUsername
		});
	}	
};

/** 
 * Send error to gambler
 *
 * @param socket
 * @param error
 */
StakeSocketService.prototype.fnSendError = function(socket, error){
	socketService.fnEmitToMe(socket, enumStakeSocketEvent.app.ERROR,{
		error: error
	});
};

/** 
 * Send an info message
 *
 */
// StakeSocketService.prototype.fnSendInfoMessage = function(socket, message){
// 	socketService.fnEmitToMe(socket, {
// 		message: message
// 	});
// };

StakeSocketService.prototype.fnVerifyAccountBalance = function(username, stakeAmount){
	var self 				= this;
	var connectedGambler 	= self.fnGetConnectedGambler(username);
	
	return accountService.fnVerifyBalance(connectedGambler.user.id, stakeAmount)
	.then(function(valid){
		if(!valid){
			self.fnSendError(connectedGambler.socket, 'Your account balance is not enough.');
		}
		return valid;
	});
};