'use strict';

/**
 * Module dependencies.
 */
var _ 				= require('lodash'),
	mongoose 		= require('mongoose'),
	Schema 	 		= mongoose.Schema,
	enumCurrency  	= require('../utilities/enums/currency'),
	enumUserRole  	= require('../utilities/enums/userrole');

/**
 * ExchangeRate Schema
 */
var ExchangeRateSchema = new Schema({
	sellerRole:{
		type: 		String,
		enum: 		[enumUserRole.BANK, enumUserRole.TRADER],
		required: 	'Seller Role is required.'
	},
	sourceCurrency: {
		type: 		String,
		enum: 		_.values(enumCurrency),
		required: 	'Source currency is required.'
	},
	destinationCurrency: {
		type: 		String,
		enum: 		_.values(enumCurrency),
		required: 	'Destination currency is required.'
	},
	rate: {
		type: 		Number,
		required: 	'Rate is required.'
	},
	fromDate: {
		type: 		Date,
		required: 	'FromDate is required.'	
	},
	createdByUser:{
		type: 	Schema.Types.ObjectId,
		ref: 	'User'
	},
	createdDate:{
		type: 		Date,
		default: 	Date.now
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
ExchangeRateSchema.pre('save', fnSetUpdatedDate);

mongoose.model('ExchangeRate', ExchangeRateSchema);