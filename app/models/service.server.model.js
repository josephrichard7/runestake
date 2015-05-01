'use strict';

/**
 * Module dependencies.
 */
var mongoose 		 	= require('mongoose'),
	Schema 			 	= mongoose.Schema,
	_ 					= require('lodash'),
	enumServiceType  	= require('../utilities/enums/servicetype'),
	enumServiceState 	= require('../utilities/enums/servicestate'),
	enumCurrency  		= require('../utilities/enums/currency');

/**
 * Service Schema
 */
var ServiceSchema = new Schema({
	requestingUser:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	attendantUser:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	type:{
		type: 		String,
		enum: 		_.values(enumServiceType),
		required: 	'Type cannot be empty or is not valid'
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
	rate:{
		type: 		Number,
		required: 	'Rate cannot be empty'
	},
	amount:{
		type: 		Number,
		required: 	'Amount cannot be empty'
	},
	amountConverted:{
		type: 		Number,
		required: 	'amountConverted cannot be empty'
	},
	state:{
		type: 		String,
		enum: 		_.values(enumServiceState),
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
ServiceSchema.pre('save', fnSetUpdatedDate);

mongoose.model('Service', ServiceSchema);