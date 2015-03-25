'use strict';

/**
 * Module dependencies.
 */
var _ 				= require('lodash'),
	util 			= require('../utilities/util'),
	enumUserState 	= require('../utilities/enums/userstate'),
	mongoose 		= require('mongoose'),
	AccountEntity 	= mongoose.model('Account');

/**
 * Functions
 */
var fnReadByID		= function(){},
	fnCreate 		= function(){},
	fnUpdate		= function(){},
	fnReadByUserId 	= function(){};

fnReadByID = function(id, callback) {
	AccountEntity
	.findById(id)
	// .lean(true) // return plain objects, not mongoose models.
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

fnCreate = function(accountVO, callback){
	var accountEntity = {};

	//Initialize entity
	accountEntity = new AccountEntity(accountVO);

	// Save the entity 
	accountEntity.save(function(err, accountEntityResult){
		util.fnProcessResultService(err, accountEntityResult, callback);
	});
};

fnUpdate = function(accountVO, callback){
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

fnReadByUserId = function(userId, callback) {
	AccountEntity
	.findOne()
	.where({user: userId})
	// .lean(true) // return plain objects, not mongoose models.
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

exports.fnReadByID 		= fnReadByID;
exports.fnCreate    	= fnCreate;
exports.fnUpdate    	= fnUpdate;
exports.fnReadByUserId 	= fnReadByUserId;