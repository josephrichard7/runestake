'use strict';

var AccountService = {};

/**
 * Module dependencies.
 */
var _ 				= require('lodash'),
	Promise			= require('bluebird'),
	util 			= require('../utilities/util'),
	mongoose 		= require('mongoose'),
	AccountEntity 	= mongoose.model('Account');

AccountService.fnReadByID = function(id, callback) {
	AccountEntity
	.findById(id)
	// .lean(true) // return plain objects, not mongoose models.
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

AccountService.fnCreate = function(accountVO, callback){
	var accountEntity = {};

	//Initialize entity
	accountEntity = new AccountEntity(accountVO);

	// Save the entity 
	accountEntity.save(function(err, accountEntityResult){
		util.fnProcessResultService(err, accountEntityResult, callback);
	});
};

AccountService.fnUpdate = function(accountVO, callback){
	var accountVOtoUpd	= accountVO;

	// Get entity by Id
	AccountEntity.findById(accountVO._id, function(err, resultReadEntity){
		if(err || !resultReadEntity){
			util.fnProcessResultService(err, null, callback);
		}else{
			// Map body request fields to model object
			resultReadEntity	= _.extend(resultReadEntity, accountVOtoUpd);

			resultReadEntity.save(function(err, resultSaveEntity){
				util.fnProcessResultService(err, resultSaveEntity, callback);
			});
		}
	});
};

AccountService.fnReadByUserId = function(userId, callback) {
	AccountEntity
	.findOne()
	.where({user: userId})
	// .lean(true) // return plain objects, not mongoose models.
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

AccountService.fnGetBalanceByUserId = function(userId, callback){
	AccountService.fnReadByUserId(userId, function(err, account){
		if(err){
			callback(err);
		}else{
			callback(null, account.balance);
		}
	});
};

module.exports = AccountService;