'use strict';

var ServiceService = {};

/**
 * Module dependencies.
 */
var _ 					= require('lodash'),
	Promise				= require('bluebird'),
	util 				= require('../utilities/util'),
	mongoose 			= require('mongoose'),
	ServiceEntity 		= mongoose.model('Service'),
	enumServiceState	= require('../utilities/enums/servicestate'),
	enumServiceType		= require('../utilities/enums/servicetype'),
	accountService 		= require('../services/account');

Promise.promisifyAll(require("mongoose"));	

var stateMachine = {};
stateMachine[enumServiceState.CREATED] = {};
stateMachine[enumServiceState.CREATED][enumServiceState.ASSIGNED] 	= true;
stateMachine[enumServiceState.CREATED][enumServiceState.CANCELED] 	= true;
stateMachine[enumServiceState.ASSIGNED] = {};
stateMachine[enumServiceState.ASSIGNED][enumServiceState.COMPLETED] = true;
stateMachine[enumServiceState.ASSIGNED][enumServiceState.DESISTED] 	= true;

ServiceService.fnReadByID = function(id) {
	return ServiceEntity.findById(id).exec();
};

ServiceService.fnVerifyBalanceForCashOut = function(userId, chipAmount){
	return accountService.fnGetBalanceByUserId(userId).then(function(accountBalance){
		if(chipAmount > accountBalance){
			throw new Error('Your account balance is not enough for cash out requested.');
		}
	});
};

ServiceService.fnCreate = function(serviceVO){
	var serviceEntity 	= {};

	return Promise.resolve(0)
	.then(function(){
		//Initialize entity
		serviceEntity = new ServiceEntity(serviceVO);
	})
	.then(function(){
		if(serviceEntity.amount === 0){
			throw new Error('Amount must be greater than 0.');
		}
		if(serviceEntity.type === enumServiceType.CASHOUT){
			return ServiceService.fnVerifyBalanceForCashOut(serviceEntity.gambler, serviceEntity.amount);	
		}
	})
	.then(function(){

		// Add missing default fields
		serviceEntity.amountConverted 	= serviceEntity.amount * serviceEntity.rate;
		serviceEntity.state 			= enumServiceState.CREATED;

		// Save the entity 
		serviceEntity.save();
		return serviceEntity;
	});
};

ServiceService.fnRead = function(serviceVO, callback) {
	ServiceService.fnReadByID(serviceVO._id, callback);
};

ServiceService.fnUpdate = function(serviceVO, callback){
	var serviceVOtoUpd	= {};

	// Get entity by Id
	ServiceEntity.findById(serviceVO._id, function(err, resultReadEntity){
		if(err || !resultReadEntity){
			util.fnProcessResultService(err, null, callback);
		}else{
			// Map body request fields to model object
			resultReadEntity	= _.extend(resultReadEntity, serviceVOtoUpd);			
			// Add missing user fields
			resultReadEntity.displayName = resultReadEntity.firstName + ' ' + resultReadEntity.lastName;

			resultReadEntity.save(function(err, resultSaveEntity){
				util.fnProcessResultService(err, resultSaveEntity, callback);
			});
		}
	});
};

ServiceEntity.validateStateMachine = function(startState, endState){
	if(stateMachine[startState][endState]){
		return true;
	}
	return false;
};

ServiceService.fnUpdateState = function(id, state, callback){
	// Get entity by Id
	ServiceEntity.findById(id, function(err, resultReadEntity){
		if(err || !resultReadEntity){
			util.fnProcessResultService(err, null, callback);
		}else{
			if(!ServiceEntity.validateStateMachine(resultReadEntity.state, state)){
				throw new Error('State change invalid.');	
			}
			resultReadEntity.state = state;

			//Update entity
			resultReadEntity.save(function(err, resultSaveEntity){
				util.fnProcessResultService(err, resultSaveEntity, callback);
			});
		}
	});
};

ServiceService.fnCancelar = function(id, callback){
	ServiceService.fnUpdateState(id, enumServiceState.CANCELED, callback);
};

ServiceService.fnListByGambler = function(id, callback){
	ServiceEntity
	.find()
	.sort('-createdDate')
	.populate({
	    path: 'trader',
	  	select: 'username'
	})
	.where('gambler').equals(id)
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

ServiceService.fnListByTrader = function(id, callback){
	ServiceEntity
	.find()
	.sort('-createdDate')
	.populate({
	    path: 'gambler',
	   	select: 'username'
	})
	.where('trader').equals(id)
	.exec(function(err, result){
		util.fnProcessResultService(err, result, callback);
	});
};

module.exports = ServiceService;