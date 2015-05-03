'use strict';

var AccountService = {};

/**
 * Module dependencies.
 */
var _ 				= require('lodash'),
	Promise			= require('bluebird'),
	mongoose 		= require('mongoose'),
	AccountEntity 	= mongoose.model('Account');

module.exports = AccountService;

AccountService.fnReadByID = function(id) {
	return AccountEntity.findById(id).exec();
};

AccountService.fnCreate = function(accountVO){
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

AccountService.fnUpdate = function(accountVO){
	var accountVOtoUpd	= accountVO;

	// Get entity by Id
	return AccountService.fnReadByID(accountVO._id)
	.then(function(resultReadEntity){
		// Map body request fields to model object
		resultReadEntity	= _.extend(resultReadEntity, accountVOtoUpd);

		resultReadEntity.save();
		return resultReadEntity;
	});
};

AccountService.fnReadByUserId = function(userId) {
	return AccountEntity
	.findOne()
	.where({user: userId})
	// .lean(true) // return plain objects, not mongoose models.
	.exec();
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

AccountService.fnWithdraw = function(id, amount){
	// Get entity by Id
	return AccountService.fnReadByID(id)
	.then(function(accountEntity){
		accountEntity.amount = accountEntity.amount - amount;

		accountEntity.save();
		return accountEntity;
	});
};

AccountService.fnDeposit = function(id, amount){
	// Get entity by Id
	return AccountService.fnReadByID(id)
	.then(function(accountEntity){
		accountEntity.amount = accountEntity.amount + amount;

		accountEntity.save();
		return accountEntity;
	});
};