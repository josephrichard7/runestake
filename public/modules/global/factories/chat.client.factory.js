'use strict';

//Service for chat
angular.module(ApplicationConfiguration.modules.global)
.factory(ApplicationConfiguration.factories.chat, [
	'$window',
	ApplicationConfiguration.factories.socket, 
	ApplicationConfiguration.services.authentication,
	function($window, SocketFactory, Authentication) {

		function Chat(namespace){
			this.enumChatEvent = {
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
		    this.enumUserChatState = {
		      DISCONNECTED:   'DISCONNECTED',
		      CONNECTED:      'CONNECTED',
		      LOGGED:         'LOGGED'
		    };
		    this.enumMessageType = {
		      USER:   'USER',
		      INFO:   'INFO'
		    };
		    this.enumUserRole   = {
		      ADMIN:    'ADMIN',
		      BANK:     'BANK',
		      TRADER:   'TRADER',
		      GAMBLER:  'GAMBLER'
		    };

		    this.nsp 				= namespace;
	    	this.username        	= Authentication.user.username;
		    this.listConnectedUsers = [];
		    this.listMessages       = [];
	    	this.chatState         	= this.enumUserChatState.DISCONNECTED;
			this.numConnectedUsers	= 0;
			this.socket 			= undefined;
			this.message 			= '';
	    }

	    Chat.prototype.fnInitSocket = function(){	    	
	    	var _this = this;
	    	if(!_this.socket){
				_this.socket = new SocketFactory(this.nsp);	    	

				_this.onConnect();
				_this.onDisconnect();
				_this.onLogin();
				_this.onNewMessage();
				_this.onUserJoined();
				_this.onUserLeft(function(data){
					if(data.username === _this.username){
						$window.location.reload();
					}
				});	
	    	}
	    };

	    // Add chat message to list
	    Chat.prototype.fnAddChatMessage = function(username, message, type) {
	    	var self = this;
			var objMessage = {
				username: username,
				message:  message,
				type:     type
			};
			self.listMessages.push(objMessage);
	    };

	    // Sends a chat message
	    Chat.prototype.fnSendMessage = function (message, callback) {
	    	var self = this;
	      	// if there is a non-empty message and a socket connection, send 'new message' to server
			if (self.message && self.chatState === self.enumUserChatState.CONNECTED) {        
				self.socket.emit(self.enumChatEvent.app.NEW_MESSAGE, self.message);
				self.message = '';
				if(callback){
					callback();
				}
			}
	    };

    	// Socket listeners

	    Chat.prototype.onConnect = function(callback){
	    	var self = this;
		    // When Maganer socketio is ready on client. This event is emit by client, not by server.
		    self.socket.on(self.enumChatEvent.natives.CONNECTION, function () {
		      	self.chatState = self.enumUserChatState.CONNECTED;
		    	if(callback){
		    		callback();
		    	}
		    });	    	
	    };

	    Chat.prototype.onDisconnect = function(callback){
	    	var self = this;
		    self.socket.on(self.enumChatEvent.natives.DISCONNECT, function () {
				self.chatState = self.enumUserChatState.DISCONNECTED;
		    	if(callback){
		    		callback();
		    	}
		    });
	    };

	    Chat.prototype.onLogin = function(callback){
	    	var self = this;
	    	// Whenever the server emits 'login', log the login message
		    self.socket.on(self.enumChatEvent.app.LOGIN, function (data) {
				self.numConnectedUsers	= data.numConnectedUsers;
				self.listConnectedUsers	= data.listConnectedUsers;
				self.fnAddChatMessage(
					data.username, 
					' logged',
					self.enumMessageType.INFO
				);
				if(callback){
					callback(data);
				}
		    });
	    };	    

	    Chat.prototype.onNewMessage = function(callback){	
	    	var self = this;
		    // Whenever the server emits 'new message', update the chat body
		    self.socket.on(self.enumChatEvent.app.NEW_MESSAGE, function (data) {
				self.fnAddChatMessage(
					data.username, 
					data.message,
					self.enumMessageType.USER
				);
		    	if(callback){
		    		callback();
		    	}
		    });	
	    };

	    Chat.prototype.onUserJoined = function(callback){
	    	var self = this;
		    // Whenever the server emits 'user joined', log it in the chat body
		    self.socket.on(self.enumChatEvent.app.USER_JOINED, function (data) {
				self.numConnectedUsers  = data.numConnectedUsers;
				self.listConnectedUsers = data.listConnectedUsers;
				self.fnAddChatMessage(	
					data.username, 
					'joined',
					self.enumMessageType.INFO
				);
		    	if(callback){
		    		callback();
		    	}
		    });
	    };

	    Chat.prototype.onUserLeft = function(callback){
	    	var self = this;
	    	// Whenever the server emits 'user left', log it in the chat body
		    self.socket.on(self.enumChatEvent.app.USER_LEFT, function (data) {
				if(data.username !== self.username){
					self.numConnectedUsers 	= data.numConnectedUsers;
					self.listConnectedUsers	= data.listConnectedUsers;        
					self.fnAddChatMessage(
						data.username, 
						'left',
						self.enumMessageType.INFO
					);
				}
				if(callback){
					callback(data);
				}
		    });
	    };

	    Chat.prototype.removeAppListeners = function(callback){
	    	var self = this;

	    	for(var eventName in this.enumChatEvent.app){
		    	self.socket.removeAllListeners(this.enumChatEvent.app[eventName]);	    		
	    	}

			if(callback){
				callback();
			}
	    };

	    return Chat;
	}
]);