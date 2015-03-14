'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	enumTransactionType = require('../../app/util/transactiontype'),
	enumTransactionState = require('../../app/util/transactionstate');

/**
 * Article Schema
 */
var TransactionSchema = new Schema({
	originAccount:{
		type: Schema.Types.ObjectId,
		ref: 'Account',
		required: 'OriginAccount cannot be empty'
	},
	destinationAccount:{
		type: Schema.Types.ObjectId,
		ref: 'Account',
		required: 'DestinationAccount cannot be empty'
	},
	game:{
		type: Schema.Types.ObjectId,
		ref: 'Game',
		required: 'Game cannot be empty'
	},
	service:{
		type: Schema.Types.ObjectId,
		ref: 'Service',
		required: 'Service cannot be empty'
	},
	transactionType:{
		type: String,
		enum: [enumTransactionType.START_GAME, enumTransactionType.END_GAME, enumTransactionType.CASH_IN, enumTransactionType.CASH_OUT],
		required: 'TransactionType cannot be empty or is not valid'
	},
	amount:{
		type: Number,
		required: 'Amount cannot be empty'
	},
	state:{
		type: String,
		enum: [enumTransactionState.PENDING, enumTransactionState.APPLIED],
		required: 'State cannot be empty or is not valid'
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
TransactionSchema.pre('save', fnSetUpdatedDate);

mongoose.model('Transaction', TransactionSchema);