'use strict';

var StakeService = {};

/**
 * Module dependencies.
 */
var _ 					= require('lodash'),
	Promise				= require('bluebird'),
	mongoose 			= require('mongoose'),
	StakeEntity 		= mongoose.model('Stake'),
	accountService 		= require('../services/account'),
	transactionService 	= require('../services/transaction'),
	enumTransactionType	= require('../utilities/enums/transactiontype'),
	enumStakeState 		= require('../utilities/enums/stakestate');

module.exports = StakeService;

StakeService.fnReadById = function(id) {
	return StakeEntity
	.findOne({id: id})
	.exec();
};

StakeService.fnCreate = function(stakeVO){
	var stakeEntity;

	return Promise.resolve(0)
	.then(function(){
		stakeEntity = new StakeEntity(stakeVO);

		stakeEntity.state 		= enumStakeState.STARTED;
		stakeEntity.startTime 	= Date.now();

		stakeEntity.profitPercentForBank = 0;
		stakeEntity.totalAmountForWinner = stakeEntity.totalAmount - (stakeEntity.totalAmount * stakeEntity.profitPercentForBank);

	})
	.then(function(){

		stakeEntity.save();
		return stakeEntity;
	});
};