'use strict';

/**
 * Module dependencies.
 */
var _ 				= require('lodash'),
	util 			= require('../utilities/util'),
	mongoose 		= require('mongoose'),
	UserEntity 		= mongoose.model('User'),
	enumUserState 	= require('../utilities/enums/userstate'),
	enumUserRole 	= require('../utilities/enums/userrole');
	// accountService 	= require('../services/account');

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
	.where('state').nin([enumUserState.DELETED])
	.select('-password -salt')	// Avoid password re-encryptation and hide critical fields
	// .lean(true) // return plain objects, not mongoose models.
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

fnCreate = function(traderVO, callback){
	var traderEntity  = {};
	var accountVO	  = {};
	var accountEntity = {};

	//Initialize entity
	traderEntity = new UserEntity(_.pick(traderVO, 'firstName', 'lastName','username', 'email', 'password', 'rank'));
	
	// Add missing default fields
	traderEntity.provider 	 = 'local';
	traderEntity.displayName = traderEntity.firstName + ' ' + traderEntity.lastName;
	traderEntity.state 		 = enumUserState.ACTIVE;
	traderEntity.role 		 = enumUserRole.TRADER;

	// Save the entity 
	traderEntity.save(function(err, result){
		if(!err){
			// Remove sensitive user data
			result.password = undefined;
			result.salt 	= undefined;

			// Create Account
			accountVO.user 	  = result;
			accountVO.balance = 0;
			// accountEntity 	  = accountService.fnCreate(accountVO);	
		}
		
		util.fnProcessResultService(err, result, callback);
	});
};

fnRead = function(traderVO, callback) {
	fnReadByID(traderVO._id, callback);
};

fnUpdate = function(traderVO, callback){
	var traderVOtoUpd	= {};

	// Get entity by Id
	UserEntity.findById(traderVO._id, function(err, resultReadEntity){
		if(err || !resultReadEntity){
			util.fnProcessResultService(err, null, callback);
		}else{
			// For security measurement only get some fields
			traderVOtoUpd	= _.pick(traderVO, 'firstName', 'lastName', 'email', 'rank', 'state');
			// Map body request fields to model object
			resultReadEntity	= _.extend(resultReadEntity, traderVOtoUpd);			
			// Add missing user fields
			resultReadEntity.displayName = resultReadEntity.firstName + ' ' + resultReadEntity.lastName;

			resultReadEntity.save(function(err, resultSaveEntity){
				if(!err){
					// Remove sensitive user data
					resultSaveEntity.password 	= undefined;
					resultSaveEntity.salt 		= undefined;
				}
				util.fnProcessResultService(err, resultSaveEntity, callback);
			});
		}
	});
};

fnDelete = function(id, callback){
	// Get entity by Id
	UserEntity.findById(id, function(err, resultReadEntity){
		if(err || !resultReadEntity){
			util.fnProcessResultService(err, null, callback);
		}else{
			// Set state to DELETED
			resultReadEntity.state = enumUserState.DELETED;

			//Update entity
			resultReadEntity.save(function(err, resultSaveEntity){
				if(!err){
					// Remove sensitive user data
					resultSaveEntity.password 	= undefined;
					resultSaveEntity.salt 		= undefined;
				}
				util.fnProcessResultService(err, resultSaveEntity, callback);
			});
		}
	});
};

fnList = function(callback){
	UserEntity
	.where('role').equals(enumUserRole.TRADER)
	.where('state').nin([enumUserState.DELETED])
	.select('-password -salt')	// Avoid password re-encryptation and hide critical fields
	.sort('-created')
	// .lean(true) // return plain objects, not mongoose models.
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

exports.fnReadByID 	= fnReadByID;
exports.fnCreate    = fnCreate;
exports.fnRead      = fnRead;
exports.fnUpdate    = fnUpdate;
exports.fnDelete    = fnDelete;
exports.fnList      = fnList;