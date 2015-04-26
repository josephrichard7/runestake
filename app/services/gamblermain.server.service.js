'use strict';

var GamblermainService = {};

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

module.exports = GamblermainService;

GamblermainService.fnReadByID = function(id) {
	return UserEntity
	.findById(id)
	.where('role').equals(enumUserRole.GAMBLER)
	.where('state').nin([enumUserState.DELETED])
	.select('-password -salt')	// Avoid password re-encryptation and hide critical fields
	// .lean(true) // return plain objects, not mongoose models.
	.exec();
};

GamblermainService.fnCreate = function(gamblerVO){
	var gamblerEntity 	= {};
	var accountVO	  	= {};

	return Promise.resolve(0)
	.then(function(){

		//Initialize entity
		gamblerEntity = new UserEntity(_.pick(gamblerVO, 'firstName', 'lastName','username', 'email', 'password', 'rank'));
		
		// Add missing default fields
		gamblerEntity.provider 		= 'local';
		gamblerEntity.displayName 	= gamblerEntity.firstName + ' ' + gamblerEntity.lastName;
		gamblerEntity.state 		= enumUserState.ACTIVE;
		gamblerEntity.role 		 	= enumUserRole.GAMBLER;

		// Save the entity 
		gamblerEntity.save();
		return gamblerEntity;
	})
	.then(function(){
		// Remove sensitive user data
		gamblerEntity.password 	= undefined;
		gamblerEntity.salt 		= undefined;

		// Create Account
		accountVO.user 	  = gamblerEntity;
		accountVO.balance = 0;
		
		return accountService.fnCreate(accountVO);
	});
};

GamblermainService.fnRead = function(gamblerVO) {
	return GamblermainService.fnReadByID(gamblerVO._id);
};

GamblermainService.fnUpdate = function(gamblerVO){
	var gamblerVOtoUpd	= {};

	// Get entity by Id
	return GamblermainService.fnReadByID(gamblerVO._id)
	.then(function(resultReadEntity){
		// For security measurement only get some fields
		gamblerVOtoUpd = _.pick(gamblerVO, 'firstName', 'lastName', 'email', 'state');
		// Map body request fields to model object
		resultReadEntity = _.extend(resultReadEntity, gamblerVOtoUpd);			
		// Add missing user fields
		resultReadEntity.displayName = resultReadEntity.firstName + ' ' + resultReadEntity.lastName;

		resultReadEntity.save();
		return resultReadEntity;
	});
};

GamblermainService.fnDelete = function(id){
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

GamblermainService.fnList = function(){
	return UserEntity
	.where('role').equals(enumUserRole.GAMBLER)
	.where('state').nin([enumUserState.DELETED])
	.select('-password -salt')	// Avoid password re-encryptation and hide critical fields
	.sort('-created')
	// .lean(true) // return plain objects, not mongoose models.
	.exec();
};