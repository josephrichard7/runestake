'use strict';

var chatSocket	= require('../app/sockets/chat');

function ConfigSocket(io, expressSession){	
	//Init sockets
	chatSocket(io, expressSession);
}

module.exports = ConfigSocket;