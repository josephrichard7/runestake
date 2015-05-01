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
	accountService 		= require('../services/account');

module.exports = ServiceService;

var stateMachine = {};
stateMachine[enumServiceState.CREATED] = {};
stateMachine[enumServiceState.CREATED][enumServiceState.DESISTED] 				= true;
stateMachine[enumServiceState.CREATED][enumServiceState.COMPLETED] 				= true;
stateMachine[enumServiceState.CREATED][enumServiceState.ABANDONED_BY_GAMBLER] 	= true;
stateMachine[enumServiceState.CREATED][enumServiceState.ABANDONED_BY_TRADER] 	= true;

// ServiceService.fnAssignTrader = function(serviceId, traderId){
// 	// Get entity by Id
// 	return ServiceService.fnReadByID(serviceId)
// 	.then(function(resultReadEntity){
// 		resultReadEntity.trader = traderId;

// 		resultReadEntity.save();
// 		return resultReadEntity;
// 	})
// 	.then(function(){
// 		return fnUpdateState(serviceId, enumServiceState.ASSIGNED);
// 	});
// };

// ServiceService.fnCancelar = function(id){
// 	return fnUpdateState(id, enumServiceState.CANCELED);
// };

ServiceService.fnAbandonedByGambler = function(id){
	return fnUpdateState(id, enumServiceState.ABANDONED_BY_GAMBLER);
};

ServiceService.fnAbandonedByTrader = function(id){
	return fnUpdateState(id, enumServiceState.ABANDONED_BY_TRADER);
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
		if(!serviceEntity.amount || serviceEntity.amount === ''){
			throw new Error('Amount must be specified.');
		}
		if(serviceEntity.type === enumServiceType.CASHOUT){
			return fnVerifyBalanceForCashOut(serviceEntity.gambler, serviceEntity.amount);	
		}
	})
	.then(function(){
		// return ExchangeRateService.fnGetRate(serviceEntity.sourceCurrency, serviceEntity.destinationCurrency);
		return serviceEntity.rate;
	})
	.then(function(rate){
		// Add missing default fields
		serviceEntity.amountConverted 	= serviceEntity.amount * rate;
		serviceEntity.state 			= enumServiceState.CREATED;

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

ServiceService.fnListByGambler = function(id){
	return ServiceEntity
	.find()
	.sort('-createdDate')
	.select('-attendantUser')
	.where('requestingUser').equals(id)
	.exec();
};

ServiceService.fnListByTrader = function(id){
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
	if(stateMachine[startState][endState]){
		return true;
	}
	return false;
}

function fnVerifyBalanceForCashOut(userId, chipAmount){
	return accountService.fnGetBalanceByUserId(userId)
	.then(function(accountBalance){
		if(chipAmount > accountBalance){
			throw new Error('Your account balance is not enough for cash out requested.');
		}
	});
}