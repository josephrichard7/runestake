'use strict';

var shareExpressSession = require('express-socket.io-session'),
	chatSocket			= require('../app/sockets/chat');

function ConfigSocket(io, expressSession){
	// Share express session with sockets
	var sharedSession = shareExpressSession(expressSession);
	
	//Init sockets
	chatSocket(io, sharedSession, expressSession);
}

module.exports = ConfigSocket;