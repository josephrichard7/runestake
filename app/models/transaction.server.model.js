'use strict';

/**
 * Module dependencies.
 */
var mongoose 			 	= require('mongoose'),
	Schema 				 	= mongoose.Schema,
	_ 						= require('lodash'),
	enumTransactionType  	= require('../utilities/enums/transactiontype'),
	enumTransactionState 	= require('../utilities/enums/transactionstate');

/**
 * Transaction Schema
 */
var TransactionSchema = new Schema({
	account:{
		type: Schema.Types.ObjectId,
		ref: 'Account',
		required: 'Account cannot be empty'
	},
	// destinationAccount:{
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Account',
	// 	required: 'DestinationAccount cannot be empty'
	// },
	stake:{
		type: Schema.Types.ObjectId,
		ref: 'Stake'
	},
	service:{
		type: Schema.Types.ObjectId,
		ref: 'Service'
	},
	type:{
		type: 		String,
		enum: 		_.values(enumTransactionType),
		required: 	'TransactionType cannot be empty or is not valid'
	},
	amount:{
		type: Number,
		required: 'Amount cannot be empty'
	},
	// profitPercent:{
	// 	type: Number,
	// 	required: 'Amount cannot be empty'
	// },
	state:{
		type: 		String,
		enum: 		_.values(enumTransactionState),
		required: 	'State cannot be empty or is not valid'
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
TransactionSchema.pre('save', fnSetUpdatedDate);

mongoose.model('Transaction', TransactionSchema);