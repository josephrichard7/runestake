'use strict';

var TransactionService = {};

/**
 * Module dependencies.
 */
var Promise					= require('bluebird'),
	mongoose 				= require('mongoose'),
	TransactionEntity 		= mongoose.model('Transaction'),
	enumServiceType			= require('../utilities/enums/servicetype'),
	enumTransactionType		= require('../utilities/enums/transactiontype'),
	enumTransactionState	= require('../utilities/enums/transactionstate'),
	accountService 			= require('../services/account'),
	gameConfigService		= require('../services/gameconfig');

module.exports = TransactionService;

/*jslint latedef: false*/
function fnCreate(transactionVO){
	var transactionEntity 	= {};

	return Promise.resolve(0)
	.then(function(){
		//Initialize entity
		transactionEntity = new TransactionEntity(transactionVO);
	})
	.then(function(){
		// Validations

		// if(transactionEntity.amount === 0){
		// 	throw new Error('Amount must be greater than 0.');
		// }
		// if(!transactionEntity.amount || serviceEntity.amount === ''){
		// 	throw new Error('Amount must be specified.');
		// }
		// if(serviceEntity.type === enumServiceType.CASHOUT){
		// 	return fnVerifyBalanceForCashOut(serviceEntity.gambler, serviceEntity.amount);	
		// }
	})
	.then(function(){
		// Add missing default fields
		transactionEntity.state = enumTransactionState.PENDING;

		// Save the entity 
		transactionEntity.save();
		return transactionEntity;
	});
}

TransactionService.fnProcessService = function(serviceEntity){
	var accountEntityRequestingUser = {};
	var accountEntityAttendantUser 	= {};
	var gameConfigEntity 			= {};		
	var listTransactionVO			= [];
	var transactionVO 				= {};

	Promise.resolve(0)
	.then(function(){
		accountEntityRequestingUser = accountService.fnReadByID(serviceEntity.requestingUser);
		return accountEntityRequestingUser;
	})
	.then(function(){
		accountEntityAttendantUser = accountService.fnReadByID(serviceEntity.attendantUser);
		return accountEntityAttendantUser;
	})
	.then(function(){
		gameConfigEntity = gameConfigService.fnRead();
	})
	.then(function(){
		transactionVO.service		= serviceEntity._id;
		transactionVO.state			= enumTransactionState.PENDING;

		if(serviceEntity.type === enumServiceType.CASHIN){
			transactionVO.type					= enumTransactionType.WITHDRAWAL;
			transactionVO.account				= accountEntityAttendantUser; // Trader
			// transactionVO.destinationAccount 	= accountEntityRequestingUser;// Gambler
			// transactionVO.profitPercent			= gameConfigEntity.profitPercentInCashInForTrader;
			transactionVO.amount				= serviceEntity.amountConverted;
			listTransactionVO.push(transactionVO);

			transactionVO.type					= enumTransactionType.DEPOSIT;
			// transactionVO.originAccount			= accountEntityAttendantUser; // Trader
			transactionVO.account 				= accountEntityRequestingUser;// Gambler
			transactionVO.amount				= serviceEntity.amountConverted;
			// transactionVO.profitPercent			= gameConfigEntity.profitPercentInCashInForTrader;
			listTransactionVO.push(transactionVO);

		}
		else if(serviceEntity.type === enumServiceType.CASHOUT){
			transactionVO.type					= enumTransactionType.WITHDRAWAL;
			// transactionVO.originAccount			= accountEntityAttendantUser; // Trader
			transactionVO.account 				= accountEntityRequestingUser;// Gambler
			transactionVO.amount				= serviceEntity.amountConverted;
			// transactionVO.profitPercent			= gameConfigEntity.profitPercentInCashInForTrader;
			listTransactionVO.push(transactionVO);

			transactionVO.type					= enumTransactionType.DEPOSIT;
			transactionVO.account				= accountEntityAttendantUser; // Trader
			// transactionVO.destinationAccount 	= accountEntityRequestingUser;// Gambler
			// transactionVO.profitPercent			= gameConfigEntity.profitPercentInCashInForTrader;
			transactionVO.amount				= serviceEntity.amountConverted;
			listTransactionVO.push(transactionVO);
		}

		return TransactionService.fnProcessList(listTransactionVO)
		.then(function(transactionEntity){
			return fnUpdateState(transactionEntity._id, enumTransactionState.APPLIED);
		});	
	});	

};

TransactionService.fnProcess = function(transactionVO){
	var promise = {};
	
	// Create transaction in PENDING state.
	promise = fnCreate(transactionVO);

	if(transactionVO.type === enumTransactionType.WITHDRAWAL){
		return promise
		.then(function(transactionEntity){
			return accountService.fnWithdrawal(transactionEntity.account, transactionEntity.amount)
			.then(function(){
				return transactionEntity;
			});
		});
	}
	else if(transactionVO.type === enumTransactionType.DEPOSIT){
		return promise
		.then(function(transactionEntity){
			return accountService.fnDeposit(transactionEntity.account, transactionEntity.amount)
			.then(function(){
				return transactionEntity;
			});
		});
	}
};

TransactionService.fnProcessList = function(listTransactionVO){
	var size 			= 0;
	var transactionVO 	= {};

	size = listTransactionVO.length;
	for(var i = 0; i < size; i++){
		transactionVO = listTransactionVO(i);

		TransactionService.fnProcess(transactionVO);
	}
};

TransactionService.fnReadByID = function(id){
	return TransactionEntity
	.findById(id)
	.populate({
		path: 'service',
		select: '-rate -attendantUser'
	})
	.exec();
};

function fnUpdateState(id, state){
	return TransactionService.fnReadByID(id)
	.then(function(transactionEntity){
		// if(!fnValidateStateMachine(transactionEntity.state, state)){
		// 	throw new Error('State change invalid.');	
		// }
		transactionEntity.state = state;

		//Update entity
		transactionEntity.save();
		return transactionEntity;
	});
}