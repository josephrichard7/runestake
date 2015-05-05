'use strict';

var TraderService = {};

/**
 * Module dependencies.
 */
var _ 				= require('lodash'),
	Promise			= require('bluebird'),
	mongoose 		= require('mongoose'),
	UserEntity 		= mongoose.model('User'),
	enumUserState 	= require('../utilities/enums/userstate'),
	enumUserRole 	= require('../utilities/enums/userrole'),
	accountService 	= require('../services/account');

module.exports = TraderService;

TraderService.fnReadByID = function(id) {
	return UserEntity
	.findById(id)
	.where('role').equals(enumUserRole.TRADER)
	.where('state').nin([enumUserState.DELETED])
	.select('-password -salt')	// Avoid password re-encryptation and hide critical fields
	// .lean(true) // return plain objects, not mongoose models.
	.exec();
};

TraderService.fnCreate = function(traderVO){
	var traderEntity  = {};
	var accountVO	  = {};

	return Promise.resolve(0)
	.then(function(){

		//Initialize entity
		traderEntity = new UserEntity(_.pick(traderVO, 'firstName', 'lastName','username', 'email', 'password', 'rank'));
		
		// Add missing default fields
		traderEntity.provider 	 = 'local';
		traderEntity.displayName = traderEntity.firstName + ' ' + traderEntity.lastName;
		traderEntity.state 		 = enumUserState.ACTIVE;
		traderEntity.role 		 = enumUserRole.TRADER;

		// Save the entity
		traderEntity.save();

		// Create Account
		accountVO.user 	  = traderEntity;
		accountVO.balance = 0;
				
		return accountService.fnCreate(accountVO)
		.then(function(){
			return traderEntity;
		});
	});
};

TraderService.fnRead = function(traderVO) {
	return TraderService.fnReadByID(traderVO._id);
};

TraderService.fnUpdate = function(traderVO){
	var traderVOtoUpd	= {};

	// Get entity by Id
	return TraderService.fnReadByID(traderVO._id)
	.then(function(resultReadEntity){
		// For security measurement only get some fields
		traderVOtoUpd	= _.pick(traderVO, 'firstName', 'lastName', 'email', 'rank', 'state');
		// Map body request fields to model object
		resultReadEntity	= _.extend(resultReadEntity, traderVOtoUpd);			
		// Add missing user fields
		resultReadEntity.displayName = resultReadEntity.firstName + ' ' + resultReadEntity.lastName;

		resultReadEntity.save();
		return resultReadEntity;
	});
};

TraderService.fnDelete = function(id){
	// Get entity by Id
	return UserEntity.findById(id,'-password -salt').exec()
	.then(function(resultReadEntity){
		// Set state to DELETED
		resultReadEntity.state = enumUserState.DELETED;

		//Update entity
		resultReadEntity.save();
		return resultReadEntity;
	});
};

TraderService.fnList = function(){
	return UserEntity
	.where('role').equals(enumUserRole.TRADER)
	.where('state').nin([enumUserState.DELETED])
	.select('-password -salt')	// Avoid password re-encryptation and hide critical fields
	.sort('-created')
	// .lean(true) // return plain objects, not mongoose models.
	.exec();
};