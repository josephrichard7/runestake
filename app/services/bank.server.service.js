'use strict';

var BankService = {};

/**
 * Module dependencies.
 */
var _ 					= require('lodash'),
	Promise				= require('bluebird'),
	mongoose 			= require('mongoose'),
	UserEntity 			= mongoose.model('User'),
	enumUserState 		= require('../utilities/enums/userstate'),
	enumUserRole 		= require('../utilities/enums/userrole'),
	accountService 		= require('../services/account'),
	transactionService 	= require('../services/transaction'),
	enumTransactionType	= require('../utilities/enums/transactiontype');

module.exports = BankService;

BankService.fnRead = function() {
	return UserEntity
	.findOne()
	.where('role').equals(enumUserRole.BANK)
	.where('state').equals([enumUserState.ACTIVE])
	.select('-password -salt')	// Avoid password re-encryptation and hide critical fields
	// .lean(true) // return plain objects, not mongoose models.
	.exec();
};

BankService.fnUpdate = function(bankVO){
	var bankVOtoUpd	= {};

	// Get entity by Id
	return BankService.fnRead()
	.then(function(resultReadEntity){
		// For security measurement only get some fields
		bankVOtoUpd	= _.pick(bankVO, 'firstName', 'lastName', 'email');
		// Map body request fields to model object
		resultReadEntity	= _.extend(resultReadEntity, bankVOtoUpd);			
		// Add missing user fields
		resultReadEntity.displayName = resultReadEntity.firstName + ' ' + resultReadEntity.lastName;

		resultReadEntity.save();
		return resultReadEntity;
	});
};

BankService.fnLoadChips = function(bankVO){
	var transactionVO	= {};

	return Promise.resolve(0)
	.then(function(){
		// Validations
		if(!bankVO || !bankVO.chipsAmount || bankVO.chipsAmount <= 0){
			throw new Error('Chips amount must be greater than 0.');
		}
	})
	.then(function(){
		return BankService.fnRead()
		.then(function(bankEntity){
			return accountService.fnReadByUserId(bankEntity._id);
		});
	})
	.then(function(accountEntity){
		transactionVO.type		= enumTransactionType.LOADCHIPSBANK;
		transactionVO.account 	= accountEntity._id; // Bank
		transactionVO.amount	= bankVO.chipsAmount;
		return transactionService.fnProcess(transactionVO);
	});
};