'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ServiceSchema = new Schema({
	trader:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	gambler:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	serviceType:{
		type: String,
		enum: ['CASH_IN','CASH_OUT'],
		required: 'ServiceType cannot be empty or is not valid'
	},
	amount:{
		type: Number,
		required: 'Amount cannot be empty'
	},
	state:{
		type: String,
		enum: ['PENDING', 'APPLIED'],
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
ServiceSchema.pre('save', fnSetUpdatedDate);

mongoose.model('Service', ServiceSchema);