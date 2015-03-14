'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var AccountSchema = new Schema({
	user:{
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: 'User cannot be empty'
	},
	balance:{
		type: Number,
		required: 'Balance cannot be empty'
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
AccountSchema.pre('save', fnSetUpdatedDate);

mongoose.model('Account', AccountSchema);