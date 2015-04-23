'use strict';

var ServiceService = {};

/**
 * Module dependencies.
 */
var _ 					= require('lodash'),
	Promise				= require('bluebird'),
	mongoose 			= require('mongoose'),
	ServiceEntity 		= mongoose.model('Service'),
	enumServiceState	= require('../utilities/enums/servicestate'),
	enumServiceType		= require('../utilities/enums/servicetype'),
	accountService 		= require('../services/account');

Promise.promisifyAll(require('mongoose'));	

var stateMachine = {};
stateMachine[enumServiceState.CREATED] = {};
stateMachine[enumServiceState.CREATED][enumServiceState.ASSIGNED] 	= true;
stateMachine[enumServiceState.CREATED][enumServiceState.CANCELED] 	= true;
stateMachine[enumServiceState.ASSIGNED] = {};
stateMachine[enumServiceState.ASSIGNED][enumServiceState.COMPLETED] = true;
stateMachine[enumServiceState.ASSIGNED][enumServiceState.DESISTED] 	= true;

ServiceService.fnAssignTrader = function(serviceId, traderId){
	// Get entity by Id
	return ServiceEntity.findById(serviceId)
	.then(function(resultReadEntity){
		resultReadEntity.trader = traderId;

		resultReadEntity.save();
		return resultReadEntity;
	})
	.then(function(){
		return fnUpdateState(serviceId, enumServiceState.ASSIGNED);
	});
};

ServiceService.fnCancelar = function(id){
	return ServiceService.fnUpdateState(id, enumServiceState.CANCELED);
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

ServiceService.fnListByGambler = function(id){
	return ServiceEntity
	.find()
	.sort('-createdDate')
	.populate({
	    path: 'trader',
	  	select: 'username'
	})
	.where('gambler').equals(id)
	.exec();
};

ServiceService.fnListByTrader = function(id){
	return ServiceEntity
	.find()
	.sort('-createdDate')
	.populate({
	    path: 'gambler',
	   	select: 'username'
	})
	.where('trader').equals(id)
	.exec();
};

ServiceService.fnReadByID = function(id) {
	return ServiceEntity.findById(id).exec();
};

/*jshint latedef: false*/
function fnUpdateState(id, state){
	// Get entity by Id
	return ServiceEntity.findById(id)
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
	return accountService.fnGetBalanceByUserId(userId).then(function(accountBalance){
		if(chipAmount > accountBalance){
			throw new Error('Your account balance is not enough for cash out requested.');
		}
	});
}

module.exports = ServiceService;