'use strict';

var ServiceService = {};

/**
 * Module dependencies.
 */
var Promise				= require('bluebird'),
	mongoose 			= require('mongoose'),
	ServiceEntity 		= mongoose.model('Service'),
	enumServiceState	= require('../utilities/enums/servicestate'),
	enumServiceType		= require('../utilities/enums/servicetype'),
	enumUserRole 		= require('../utilities/enums/userrole'),
	stateMachineService = require('../utilities/statemachines/service'),
	accountService 		= require('../services/account'),
	exchangeRateService = require('../services/exchangerate'),
	transactionService 	= require('../services/transaction');

module.exports = ServiceService;

ServiceService.fnAbandonedByGambler = function(id){
	return fnUpdateState(id, enumServiceState.ABANDONED_BY_GAMBLER);
};

ServiceService.fnAbandonedByTrader = function(id){
	return fnUpdateState(id, enumServiceState.ABANDONED_BY_TRADER);
};

ServiceService.fnAbandonedByBank = function(id){
	return fnUpdateState(id, enumServiceState.ABANDONED_BY_BANK);
};

ServiceService.fnCreate = function(serviceVO){
	var serviceEntity 	= {};
	var seller;
	var errMessage;
	var userId;
	var chipsAmount;

	return Promise.resolve(0)
	.then(function(){
		//Initialize entity
		serviceEntity = new ServiceEntity(serviceVO);

		if(serviceEntity.amount === 0){
			throw new Error('Amount must be greater than 0.');
		}else if(!serviceEntity.amount || serviceEntity.amount === ''){
			throw new Error('Amount must be specified.');
		}
	})
	.then(function(){
		if(serviceEntity.type === enumServiceType.CASHIN || serviceEntity.type === enumServiceType.CASHOUT){
			seller = enumUserRole.TRADER;
		}else if(serviceEntity.type === enumServiceType.BUYCHIPSTOBANK){
			seller = enumUserRole.BANK;
		}

		return exchangeRateService.fnRead(seller, serviceEntity.sourceCurrency, serviceEntity.destinationCurrency)
		.then(function(exchangeRate){
			return exchangeRate.rate;
		});
	})
	.then(function(rate){
		// Add missing default fields
		serviceEntity.amountConverted 	= serviceEntity.amount * rate;
		serviceEntity.state 			= enumServiceState.CREATED;

		// Validate balance
		if(serviceEntity.type === enumServiceType.CASHOUT){
			errMessage 	= 'Your account balance is not enough for cash out requested.';
			userId 		= serviceEntity.requestingUser;
			chipsAmount	= serviceEntity.amount;
		}
		else if(serviceEntity.type === enumServiceType.CASHIN){
			errMessage 	= 'Trader can not attend this service.';
			userId 		= serviceEntity.attendantUser;
			chipsAmount	= serviceEntity.amountConverted;
		}		
		else if(serviceEntity.type === enumServiceType.BUYCHIPSTOBANK){
			errMessage 	= 'Bank can not attend this service.';
			userId 		= serviceEntity.attendantUser;
			chipsAmount	= serviceEntity.amountConverted;
		}

		return accountService.fnVerifyBalance(userId, chipsAmount)
		.then(function(valid){
			if(!valid){
				throw new Error(errMessage);
			}
		});
	})
	.then(function(){
		// Save the entity 
		serviceEntity.save();
		return serviceEntity;
	});
};

ServiceService.fnComplete = function(id){
	// Get entity by Id
	return ServiceService.fnReadByID(id)
	.then(function(serviceEntity){
		// Update service to PROCESSING
		return fnUpdateState(id, enumServiceState.PROCESSING)
		// Generate transactions for the service
		.then(function(){
			return transactionService.fnProcessService(serviceEntity);
		})
		// If an error ocurrs while generate transactions, update service state to ERROR
		.then(null, function(err){
			return fnUpdateState(id, enumServiceState.ERROR);
		})
		// If generate transactions successfully, update service state to COMPLETED
		.then(function(){
			return fnUpdateState(id, enumServiceState.COMPLETED);
		});
	});	
};

ServiceService.fnDesist = function(id){
	return fnUpdateState(id, enumServiceState.DESISTED);
};

ServiceService.fnListByRequestingUser = function(id){
	return ServiceEntity
	.find()
	.sort('-createdDate')
	.select('-attendantUser')
	.where('requestingUser').equals(id)
	.exec();
};

ServiceService.fnListByAttendantUser = function(id){
	return ServiceEntity
	.find()
	.sort('-createdDate')
	.populate({
	    path: 'requestingUser',
	   	select: 'username'
	})
	.populate({
	    path: 'attendantUser',
	   	select: 'username'
	})
	.where('attendantUser').equals(id)
	.exec();
};

ServiceService.fnReadByID = function(id) {
	return ServiceEntity
	.findById(id)
	.populate({
	    path: 'requestingUser',
	   	select: 'username'
	})
	.populate({
	    path: 'attendantUser',
	   	select: 'username'
	})
	// .lean(true)
	.exec();
};

ServiceService.fnReadByIDByGambler = function(id) {
	return ServiceEntity
	.findById(id)
	.populate({
	    path: 'requestingUser',
	   	select: 'username'
	})
	.select('-attendantUser')
	.exec();
};

/*jshint latedef: false*/
function fnUpdateState(id, state){
	// Get entity by Id
	return ServiceService.fnReadByID(id)
	.then(function(resultReadEntity){
		if(!fnValidateStateMachine(resultReadEntity.state, state)){
			throw new Error('State change invalid.');	
		}
		resultReadEntity.state = state;

		//Update entity
		resultReadEntity.save();
		return resultReadEntity;
	});
}

function fnValidateStateMachine(startState, endState){
	if(stateMachineService[startState][endState]){
		return true;
	}
	return false;
}