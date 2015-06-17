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
	hitService 			= require('../services/hit'),
	stateMachineService = require('../utilities/statemachines/stake'),
	enumStakeState 		= require('../utilities/enums/stakestate');

module.exports = StakeService;

StakeService.fnReadById = function(id) {
	return StakeEntity
	.findById(id)
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

StakeService.fnFinish = function(id, winnerGambler, listHit){
	var stakeEntity;

	return StakeService.fnReadById(id)
	.then(function(resultEntity){
		stakeEntity = resultEntity;

		// Update stake to PROCESSING
		return fnUpdateState(id, enumStakeState.PROCESSING)
		// Update winner and loser
		.then(function(){
			stakeEntity.winnerGambler = winnerGambler;

			if(stakeEntity.leftGambler.username === winnerGambler){
				stakeEntity.loserGambler = stakeEntity.rightGambler;
			}else{
				stakeEntity.loserGambler = stakeEntity.leftGambler;
			}

			stakeEntity.finishTime 	= Date.now();

			stakeEntity.save();
			return stakeEntity;
		})
		// Save the hits of the stake
		.then(function(){
			return hitService.fnSaveHits(id, listHit);
		})
		// Generate transactions for the stake
		.then(function(){
			return transactionService.fnProcessStake(stakeEntity);
		})
		// If an error ocurrs while generate transactions, update stake state to ERROR
		.then(null, function(err){
			return fnUpdateState(id, enumStakeState.ERROR);
		})
		// If generate transactions successfully, update stake state to FINISHED
		.then(function(){
			return fnUpdateState(id, enumStakeState.FINISHED);
		});
	});
};

StakeService.fnReadById = function(id){
	return StakeEntity
	.findById(id)
	.populate({
	    path: 'leftGambler',
	   	select: 'username'
	})
	.populate({
	    path: 'rightGambler',
	   	select: 'username'
	})
	.populate({
	    path: 'winnerGambler',
	   	select: 'username'
	})
	.populate({
	    path: 'loserGambler',
	   	select: 'username'
	})
	.exec();
};

/*jshint latedef: false*/
function fnUpdateState(id, state){
	// Get entity by Id
	return StakeService.fnReadByID(id)
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