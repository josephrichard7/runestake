'user strict';

module.exports = ServiceTrader;

/*jshint latedef: false */
function ServiceTrader(user, socket){
	this.user 			= user;
	this.traderSockets 	= {};

	addSocket(socket);
}

ServiceTrader.prototype.addSocket = function (socket){
	this.traderSockets[socket.id] = socket;
};

ServiceTrader.prototype.emit = (socket){
	this.traderSockets[socket.id] = socket;
};