'use strict';

/**
 * Module dependencies.
 */
var _ 				= require('lodash'),
	mongoose 	  	= require('mongoose'),
	Schema 		  	= mongoose.Schema;

/**
 * Stake Schema
 */
var HitSchema = new Schema({
	stake:{
		type: Schema.Types.ObjectId,
		ref: 'Stake'
	},
	leftGamblerHit:{
		type: 		Number
	},
	rightGamblerHit:{
		type: 		Number
	},
	hitTime:{
		type: Date
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
HitSchema.pre('save', fnSetUpdatedDate);

mongoose.model('Hit', HitSchema);