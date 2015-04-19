'use strict';

/**
 * Module dependencies.
 */
var _ 				= require('lodash'),
	util 			= require('../utilities/util'),
	mongoose 		= require('mongoose'),
	UserEntity 		= mongoose.model('User'),
	enumUserState 	= require('../utilities/enums/userstate'),
	enumUserRole 	= require('../utilities/enums/userrole'),
	accountService 	= require('../services/account');

/**
 * Functions
 */
var fnReadByID	= function(){},
	fnCreate 	= function(){},
	fnRead 		= function(){},
	fnUpdate	= function(){},
	fnDelete 	= function(){},
	fnList 		= function(){};

fnReadByID = function(id, callback) {
	UserEntity
	.findById(id)
	.where('role').equals(enumUserRole.GAMBLER)
	.where('state').nin([enumUserState.DELETED])
	.select('-password -salt')	// Avoid password re-encryptation and hide critical fields
	// .lean(true) // return plain objects, not mongoose models.
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

fnCreate = function(gamblerVO, callback){
	var gamblerEntity  = {};
	var accountVO	  = {};
	var accountEntity = {};

	//Initialize entity
	gamblerEntity = new UserEntity(_.pick(gamblerVO, 'firstName', 'lastName','username', 'email', 'password', 'rank'));
	
	// Add missing default fields
	gamblerEntity.provider 		= 'local';
	gamblerEntity.displayName 	= gamblerEntity.firstName + ' ' + gamblerEntity.lastName;
	gamblerEntity.state 		= enumUserState.ACTIVE;
	gamblerEntity.role 		 	= enumUserRole.GAMBLER;

	// Save the entity 
	gamblerEntity.save(function(err, gamblerEntityResult){
		if(err){
			util.fnProcessResultService(err, null, callback);
		}else{
			// Remove sensitive user data
			gamblerEntityResult.password = undefined;
			gamblerEntityResult.salt 	= undefined;

			// Create Account
			accountVO.user 	  = gamblerEntityResult;
			accountVO.balance = 0;
			
			accountService.fnCreate(accountVO,function(err, accountVOResult){
				util.fnProcessResultService(err, gamblerEntityResult, callback);
			});
		}
	});
};

fnRead = function(gamblerVO, callback) {
	fnReadByID(gamblerVO._id, callback);
};

fnUpdate = function(gamblerVO, callback){
	var gamblerVOtoUpd	= {};

	// Get entity by Id
	UserEntity.findById(gamblerVO._id,'-password -salt', function(err, resultReadEntity){
		if(err || !resultReadEntity){
			util.fnProcessResultService(err, null, callback);
		}else{
			// For security measurement only get some fields
			gamblerVOtoUpd	= _.pick(gamblerVO, 'firstName', 'lastName', 'email', 'state');
			// Map body request fields to model object
			resultReadEntity	= _.extend(resultReadEntity, gamblerVOtoUpd);			
			// Add missing user fields
			resultReadEntity.displayName = resultReadEntity.firstName + ' ' + resultReadEntity.lastName;

			resultReadEntity.save(function(err, resultSaveEntity){
				util.fnProcessResultService(err, resultSaveEntity, callback);
			});
		}
	});
};

fnDelete = function(id, callback){
	// Get entity by Id
	UserEntity.findById(id,'-password -salt', function(err, resultReadEntity){
		if(err || !resultReadEntity){
			util.fnProcessResultService(err, null, callback);
		}else{
			// Set state to DELETED
			resultReadEntity.state = enumUserState.DELETED;

			//Update entity
			resultReadEntity.save(function(err, resultSaveEntity){
				util.fnProcessResultService(err, resultSaveEntity, callback);
			});
		}
	});
};

fnList = function(callback){
	UserEntity
	.where('role').equals(enumUserRole.GAMBLER)
	.where('state').nin([enumUserState.DELETED])
	.select('-password -salt')	// Avoid password re-encryptation and hide critical fields
	.sort('-created')
	// .lean(true) // return plain objects, not mongoose models.
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

exports.fnReadByID 	= fnReadByID;
// exports.fnCreate    = fnCreate;
// exports.fnRead      = fnRead;
// exports.fnUpdate    = fnUpdate;
// exports.fnDelete    = fnDelete;
// exports.fnList      = fnList;