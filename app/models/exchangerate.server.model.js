'use strict';

/**
 * Module dependencies.
 */
var mongoose 		= require('mongoose'),
	Schema 	 		= mongoose.Schema,
	_ 				= require('lodash'),
	enumCurrency  	= require('../utilities/enums/currency');

/**
 * ExchangeRate Schema
 */
var ExchangeRateSchema = new Schema({
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
		type: Number,
		required: 'Rate is required.'
	},
	fromDate: {
		type: Date,
		required: 'Source currency is required.'	
	},
	createdByUser:{
		type: Schema.Types.ObjectId,
		ref: 'User'
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
ExchangeRateSchema.pre('save', fnSetUpdatedDate);

mongoose.model('ExchangeRate', ExchangeRateSchema);