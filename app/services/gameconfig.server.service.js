'use strict';

var GameConfigService = {};

/**
 * Module dependencies.
 */
var Promise				= require('bluebird'),
	mongoose 			= require('mongoose'),
	GameConfigEntity 	= mongoose.model('GameConfig');

module.exports = GameConfigService;

GameConfigService.fnRead = function() {
	return GameConfigEntity
	.findOne()
	.lean(true) // return plain objects, not mongoose models.
	.exec();
};