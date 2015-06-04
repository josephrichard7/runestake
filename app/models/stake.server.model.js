'use strict';

/**
 * Module dependencies.
 */
var _ 				= require('lodash'),
	mongoose 	  	= require('mongoose'),
	Schema 		  	= mongoose.Schema,
	enumGameState 	= require('../utilities/enums/stakestate');

/**
 * Stake Schema
 */
var StakeSchema = new Schema({
	leftGambler:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	rightGambler:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	winnerGambler:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	loserGambler:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	totalAmount:{
		type: Number,
		required: 'TotalAmount cannot be empty'
	},
	profitPercentForBank:{
		type: Number,
		required: 'ProfitPercent cannot be empty'
	},
	totalAmountForWinner:{
		type: Number,
		required: 'TotalAmount cannot be empty'
	},
	state:{
		type: String,
		enum: _.values(enumGameState)
	},
	startTime:{
		type: Date
	},
	finishTime:{
		type: Date
	},
	createdDate:{
		type: Date,
		default: Date.now
	},
	updatedDate:{
		type: Date
	}
});

/* Set date now to updated field */
function fnSetUpdatedDate(next){
    /*jshint validthis:true */
	this.updatedDate = Date.now();
	next();
}

/*Middleware functions*/
StakeSchema.pre('save', fnSetUpdatedDate);

mongoose.model('Stake', StakeSchema);