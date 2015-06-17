'use strict';

var enumStakeState = require('../enums/stakestate');

var StateMachineService = {};
StateMachineService[enumStakeState.CREATED] = {};
StateMachineService[enumStakeState.CREATED][enumStakeState.PROCESSING] 				= true;
StateMachineService[enumStakeState.PROCESSING] = {};
StateMachineService[enumStakeState.PROCESSING][enumStakeState.FINISHED] 			= true;
StateMachineService[enumStakeState.PROCESSING][enumStakeState.ERROR]	 			= true;

module.exports = StateMachineService;