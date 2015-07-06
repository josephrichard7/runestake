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
	accountService 			= require('../services/account');
	// gameConfigService		= require('../services/gameconfig');

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

TransactionService.fnList = function(userId){
	return accountService.fnReadByUserId(userId)
	.then(function(accountEntity){
		return TransactionEntity
		.find()
		.where('account').equals(accountEntity._id)
		.sort('-createdDate')
		.populate({
		    path: 'service',
		   	select: '-rate -attendantUser'
		})
		.populate({
		    path: 'game'
		})
		// .lean(true) // return plain objects, not mongoose models.
		.exec();
	});
};

TransactionService.fnProcess = function(transactionVO){
	transactionVO.state	= enumTransactionState.PENDING;

	// Create transaction in PENDING state.
	return fnCreate(transactionVO)
	.then(function(transactionEntity){
		if(transactionEntity.type === enumTransactionType.WITHDRAWAL){
			return accountService.fnWithdraw(transactionEntity.account, transactionEntity.amount)
			.then(function(){
				return transactionEntity;
			});
		}
		else if(transactionEntity.type === enumTransactionType.DEPOSIT){
			return accountService.fnDeposit(transactionEntity.account, transactionEntity.amount)
			.then(function(){
				return transactionEntity;
			});
		}
		else if(transactionEntity.type === enumTransactionType.LOADCHIPSBANK){
			return accountService.fnDeposit(transactionEntity.account, transactionEntity.amount)
			.then(function(){
				return transactionEntity;
			});
		}
	})
	.then(function(transactionEntity){
		return fnUpdateState(transactionEntity._id, enumTransactionState.APPLIED);
	});	
};

TransactionService.fnProcessService = function(serviceEntity){
	var accountEntityRequestingUser = {};
	var accountEntityAttendantUser 	= {};
	// var gameConfigEntity 			= {};		
	// var listTransactionVO			= [];
	var transactionVO 				= {};
	var promise 					= Promise.resolve(0);

	return promise
	.then(function(){
		return accountService.fnReadByUserId(serviceEntity.requestingUser._id)
		.then(function(accountEntity){
			accountEntityRequestingUser = accountEntity;
		});
	})
	.then(function(){
		return accountService.fnReadByUserId(serviceEntity.attendantUser._id)
		.then(function(accountEntity){
			accountEntityAttendantUser = accountEntity;
		});
	})
	// .then(function(){
	// 	gameConfigEntity = gameConfigService.fnRead();
	// })
	.then(function(){
		transactionVO.service 	= serviceEntity._id;

		if(serviceEntity.type === enumServiceType.CASHIN){
			return promise
			.then(function(){
				transactionVO.type					= enumTransactionType.WITHDRAWAL;
				transactionVO.account				= accountEntityAttendantUser._id; // Trader
				// transactionVO.profitPercent			= gameConfigEntity.profitPercentInCashInForTrader;
				transactionVO.amount				= serviceEntity.amountConverted;
				return TransactionService.fnProcess(transactionVO);
			})
			.then(function(){
				transactionVO.type					= enumTransactionType.DEPOSIT;
				transactionVO.account 				= accountEntityRequestingUser._id;// Gambler
				transactionVO.amount				= serviceEntity.amountConverted;
				// transactionVO.profitPercent			= gameConfigEntity.profitPercentInCashInForTrader;
				return TransactionService.fnProcess(transactionVO);
			});
		}
		else if(serviceEntity.type === enumServiceType.CASHOUT){
			return promise
			.then(function(){
				transactionVO.type					= enumTransactionType.WITHDRAWAL;
				transactionVO.account 				= accountEntityRequestingUser;// Gambler
				transactionVO.amount				= serviceEntity.amount;
				// transactionVO.profitPercent			= gameConfigEntity.profitPercentInCashInForTrader;
				return TransactionService.fnProcess(transactionVO);
			})
			.then(function(){
				transactionVO.type					= enumTransactionType.DEPOSIT;
				transactionVO.account				= accountEntityAttendantUser; // Trader
				// transactionVO.profitPercent			= gameConfigEntity.profitPercentInCashInForTrader;
				transactionVO.amount				= serviceEntity.amount;
				return TransactionService.fnProcess(transactionVO);
			});
		}
		else if(serviceEntity.type === enumServiceType.BUYCHIPSTOBANK){
			return promise
			.then(function(){
				transactionVO.type					= enumTransactionType.WITHDRAWAL;
				transactionVO.account 				= accountEntityAttendantUser;// Bank
				transactionVO.amount				= serviceEntity.amountConverted;
				// transactionVO.profitPercent			= gameConfigEntity.profitPercentInCashInForTrader;
				return TransactionService.fnProcess(transactionVO);
			})
			.then(function(){
				transactionVO.type					= enumTransactionType.DEPOSIT;
				transactionVO.account				= accountEntityRequestingUser; // Trader
				// transactionVO.profitPercent			= gameConfigEntity.profitPercentInCashInForTrader;
				transactionVO.amount				= serviceEntity.amountConverted;
				return TransactionService.fnProcess(transactionVO);
			});
		}
	});	

};

TransactionService.fnProcessStake = function(stakeEntity){
	var accountEntityLoserGambler 	= {};
	var accountEntityWinnerGambler 	= {};
	var transactionVO 				= {};
	var promise 					= Promise.resolve(0);

	return promise
	.then(function(){
		return accountService.fnReadByUserId(stakeEntity.loserGambler._id)
		.then(function(accountEntity){
			accountEntityLoserGambler = accountEntity;
		});
	})
	.then(function(){
		return accountService.fnReadByUserId(stakeEntity.winnerGambler._id)
		.then(function(accountEntity){
			accountEntityWinnerGambler = accountEntity;
		});
	})
	.then(function(){
		transactionVO.stake 	= stakeEntity._id;

		return promise
		.then(function(){
			transactionVO.type					= enumTransactionType.WITHDRAWAL;
			transactionVO.account				= accountEntityLoserGambler._id;
			transactionVO.amount				= stakeEntity.totalAmount / 2;
			return TransactionService.fnProcess(transactionVO);
		})
		.then(function(){
			transactionVO.type					= enumTransactionType.DEPOSIT;
			transactionVO.account 				= accountEntityWinnerGambler._id;
			transactionVO.amount				= stakeEntity.totalAmountForWinner;
			return TransactionService.fnProcess(transactionVO);
		});
		// Bank Comission
		// .then(function(){
		// 	transactionVO.type					= enumTransactionType.DEPOSIT;
		// 	transactionVO.account 				= accountEntityWinnerGambler._id;
		// 	transactionVO.amount				= stakeEntity.totalAmountForWinner;
		// 	return TransactionService.fnProcess(transactionVO);
		// });
	});	

};

TransactionService.fnReadById = function(id){
	return TransactionEntity
	.findById(id)
	.populate({
		path: 'service',
		select: '-rate -attendantUser'
	})
	.exec();
};

function fnUpdateState(id, state){
	return TransactionService.fnReadById(id)
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