'use strict';

module.exports = {
	app: {
		title: 			'Runestake',
		description: 	'Gambling site for gamers',
		keywords: 		'rs, gambler'
	},
	port: 				process.env.PORT || 3000,
	templateEngine: 	'swig',
	viewsSuffix: 		'server.view.html',
	sessionSecret: 		'MEAN_runestake',
	sessionCollection: 	'sessions',
	enviroments: {
		production: 	'production',
		development: 	'development'
	},
	appPaths: {
		models: 			'./app/models/**/*.js',
		routes: 			'./app/routes/**/*.js',
		serverViews: 		'./app/views',
		// passportStrategies: './config/strategies/**/*.js',
		passportStrategies: './config/strategies/local.js',
		public: 			'./public'
	},
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/jquery/dist/jquery.js',
				'public/lib/angular-utils-pagination/dirPagination.js',
				'public/lib/socket.io-client/socket.io.js',
				'public/lib/bundle/bundle.js'
			]
		},
		serverFiles:[
			'./utilities/enums/chatevent.server.enum.js'
		],
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};