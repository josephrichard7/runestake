'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('../controllers/users/users.authentication'),
	require('../controllers/users/users.authorization'),
	require('../controllers/users/users.password'),
	require('../controllers/users/users.profile')
);