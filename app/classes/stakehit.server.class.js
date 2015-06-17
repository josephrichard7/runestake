'use strict';

var Util 			= require('../utilities/util');

module.exports = StakeHit;

/*jshint latedef: false */
function StakeHit(){
	this.leftGamblerHitFirst 			= false;
	this.amountHitReceivedRightGambler	= 0;
	this.amountHitReceivedLeftGambler	= 0;

	this.fnGenerateHit();
}

StakeHit.prototype.fnGenerateHit = function(){
	var hitFirstRandomNumber 	= Math.random();
	var hitRandomNumber 		= 0;
	var sizeARRAYHITVALUE 		= Util.ARRAY_HITVALUE.length - 1;

	// Decides which gambler hit first
	if(hitFirstRandomNumber > 0.5){
		this.leftGamblerHitFirst = true;
	}else{
		this.leftGamblerHitFirst = false;
	}

	hitRandomNumber = Math.round(Math.random() * sizeARRAYHITVALUE);
	this.amountHitReceivedRightGambler 	= Util.ARRAY_HITVALUE[hitRandomNumber];

	hitRandomNumber = Math.round(Math.random() * sizeARRAYHITVALUE);
	this.amountHitReceivedLeftGambler 	= Util.ARRAY_HITVALUE[hitRandomNumber];
};