'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema 	 = mongoose.Schema;

/**
 * GameConfig Schema
 */
var GameConfigSchema = new Schema({
	profitPercentInStakeForBank:{
		type: Number
	},
	profitPercentInCashInForTrader:{
		type: Number
	},
	profitPercentInCashOutForTrader:{
		type: Number
	},
	updatedByUser:{
		type: Schema.Types.ObjectId,
		ref: 'User'
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
GameConfigSchema.pre('save', fnSetUpdatedDate);

mongoose.model('GameConfig', GameConfigSchema);