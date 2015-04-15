'use strict';

var ServiceService = {};

/**
 * Module dependencies.
 */
var _ 					= require('lodash'),
	util 				= require('../utilities/util'),
	mongoose 			= require('mongoose'),
	ServiceEntity 		= mongoose.model('Service'),
	enumServiceState	= require('../utilities/enums/servicestate'),
	enumServiceType		= require('../utilities/enums/servicetype');

ServiceService.fnReadByID = function(id, callback) {
	ServiceEntity
	.findById(id)
	// .where('role').equals(enumUserRole.TRADER)
	// .where('state').nin([enumUserState.DELETED])
	// .select('-password -salt')	// Avoid password re-encryptation and hide critical fields
	// .lean(true) // return plain objects, not mongoose models.
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

ServiceService.fnCreate = function(serviceVO, callback){
	var serviceEntity = {};
	var accountVO	  = {};
	var accountEntity = {};

	//Initialize entity
	serviceEntity = new ServiceEntity(_.pick(serviceVO, 'firstName', 'lastName','username', 'email', 'password', 'rank'));
	
	// Add missing default fields
	serviceEntity.state 		 = enumServiceState.ACTIVE;

	// Save the entity 
	serviceEntity.save(function(err, serviceEntityResult){
		if(err){
			util.fnProcessResultService(err, null, callback);
		}else{
			// Create Account
			// accountVO.user 	  = serviceEntityResult;
			// accountVO.balance = 0;
			
			// accountService.fnCreate(accountVO,function(err, accountVOResult){
			// 	util.fnProcessResultService(err, serviceEntityResult, callback);
			// });
			util.fnProcessResultService(err, serviceEntityResult, callback);
		}
	});
};

ServiceService.fnRead = function(traderVO, callback) {
	ServiceService.fnReadByID(traderVO._id, callback);
};

ServiceService.fnUpdate = function(traderVO, callback){
	var traderVOtoUpd	= {};

	// Get entity by Id
	ServiceEntity.findById(traderVO._id,'-password -salt', function(err, resultReadEntity){
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
				util.fnProcessResultService(err, resultSaveEntity, callback);
			});
		}
	});
};

ServiceService.fnDelete = function(id, callback){
	// Get entity by Id
	ServiceEntity.findById(id,'-password -salt', function(err, resultReadEntity){
		if(err || !resultReadEntity){
			util.fnProcessResultService(err, null, callback);
		}else{
			// Set state to DELETED
			resultReadEntity.state = enumServiceState.DELETED;

			//Update entity
			resultReadEntity.save(function(err, resultSaveEntity){
				util.fnProcessResultService(err, resultSaveEntity, callback);
			});
		}
	});
};

ServiceService.fnList = function(callback){
	ServiceEntity
	// .where('role').equals(enumUserRole.TRADER)
	// .where('state').nin([enumUserState.DELETED])
	// .select('-password -salt')	// Avoid password re-encryptation and hide critical fields
	// .sort('-created')
	// .lean(true) // return plain objects, not mongoose models.
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

module.exports = ServiceService;