'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	glob = require('glob');


module.exports = getEnvironmentConfig;

/**
 * Load app configurations
 */
/*jshint latedef: false */
function getEnvironmentConfig(){
	var _this;

	_this = _.extend(
		require('./env/all'),
		require('./env/' + process.env.NODE_ENV) || {}
	);


	_this.getGlobbedFiles 		= getGlobbedFiles;
	_this.getJavaScriptAssets 	= getJavaScriptAssets;
	_this.getCSSAssets 			= getCSSAssets;

	/**
	 * Get files by glob patterns
	 */
	/*jshint latedef: false */
	function getGlobbedFiles(globPatterns, removeRoot) {
		// URL paths regex
		var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

		// The output array
		var output = [];

		// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
		if (_.isArray(globPatterns)) {
			globPatterns.forEach(function(globPattern) {
				output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
			});
		} else if (_.isString(globPatterns)) {
			if (urlRegex.test(globPatterns)) {
				output.push(globPatterns);
			} else {
				glob(globPatterns, {
					sync: true
				}, function(err, files) {
					if (removeRoot) {
						files = files.map(function(file) {
							return file.replace(removeRoot, '');
						});
					}

					output = _.union(output, files);
				});
			}
		}

		return output;
	}

	/**
	 * Get the modules JavaScript files
	 */
	/*jshint latedef: false */
	function getJavaScriptAssets(includeTests) {
		var output = _this.getGlobbedFiles(_this.assets.lib.js.concat(_this.assets.js), 'public/');

		// output = _.union(output, _this.getGlobbedFiles(_this.assets.enums, 'app/utilities/'));
		
		// To include tests
		if (includeTests) {
			output = _.union(output, _this.getGlobbedFiles(_this.assets.tests));
		}

		return output;
	}

	/**
	 * Get the modules CSS files
	 */
	/*jshint latedef: false */
	function getCSSAssets() {
		var output = _this.getGlobbedFiles(_this.assets.lib.css.concat(_this.assets.css), 'public/');
		return output;
	}

	return _this; 
}

