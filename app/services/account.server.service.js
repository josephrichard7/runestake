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
	return AccountEntity.findById(id).exec();
};

AccountService.fnCreate = function(accountVO, callback){
	var accountEntity = {};

	Promise.resolve(0)
	.then(function(){
		//Initialize entity
		accountEntity = new AccountEntity(accountVO);	
	})
	.then(function(){
		// Save the entity 
		accountEntity.save();
		return accountEntity;
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

AccountService.fnGetBalanceByUserId = function(userId){
	return AccountEntity
	.findOne()
	.where({user: userId})
	// .lean(true) // return plain objects, not mongoose models.
	.exec().then(function(account){
		return account.balance;
	});
};

module.exports = AccountService;