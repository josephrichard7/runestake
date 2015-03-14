'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	enumGameState = require('../../app/util/gamestate');

/**
 * Article Schema
 */
var GameSchema = new Schema({
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
	profitPercent:{
		type: Number,
		required: 'ProfitPercent cannot be empty'
	},
	state:{
		type: String,
		enum: [enumGameState.SEARCHING_GAMBLER, enumGameState.IN_PROCESS, enumGameState.FINISHED]
	},
	startTime:{
		type: Date
	},
	finishTime:{
		type: Date
	},
	createdDate:{
		type: Date,
		default: Date.now()
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
GameSchema.pre('save', fnSetUpdatedDate);

mongoose.model('Game', GameSchema);