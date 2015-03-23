'use strict';

var getUniqueErrorMessage = function(){},
	getErrorMessage 	  = function(){},
	fnHandleErrorMW		  = function(){};

/**
 * Get unique error field name
 */
getUniqueErrorMessage = function(err) {
	var output;

	try {
		var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
		output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exist';

	} catch(ex) {
		output = 'Unique field already exist';
	}

	return output;
};

/**
 * Get the error message from error object
 */
getErrorMessage = function(err) {
	var message = '';
	
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = getUniqueErrorMessage(err);
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Error handler after business service execution.
 */
fnHandleErrorMW = function(err, res) {
 	return res.status(400).send({
		message: getErrorMessage(err)
	});
};

exports.getErrorMessage 	= getErrorMessage;
exports.fnHandleErrorMW		= fnHandleErrorMW;