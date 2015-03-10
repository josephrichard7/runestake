'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * UserXrole Schema
 */
var UserXroleSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	role: {
		type: String,
		enum: ['ADMIN', 'BANK', 'TRADER', 'GAMBLER']
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
UserXroleSchema.pre('save', fnSetUpdatedDate);

mongoose.model('UserXrole', UserXroleSchema);