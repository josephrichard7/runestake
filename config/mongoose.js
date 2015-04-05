'use strict';

var mongoose 	= require('mongoose');

module.exports = function (config){

	var db = mongoose.connect(config.db, function(err) {
		if (err) {
			console.error('\x1b[31m', 'Could not connect to MongoDB!');
			console.log(err);
			throw err;
		}
	});

	return db;
};