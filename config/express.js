'use strict';

/**
 * Module dependencies.
 */
var express 		= require('express'),
	morgan 			= require('morgan'),
	bodyParser 		= require('body-parser'),
	session 		= require('express-session'),
	compress 		= require('compression'),
	methodOverride 	= require('method-override'),
	cookieParser 	= require('cookie-parser'),
	helmet 			= require('helmet'),
	passport 		= require('passport'),
	mongoStore 		= require('connect-mongo')({session: session}),
	flash 			= require('connect-flash'),
	consolidate		= require('consolidate'),
	path 			= require('path'),
	socketio		= require('socket.io'),
	browserify      = require('browserify'),
	fs 				= require('fs'),
	Promise 		= require('bluebird'),
	mongoose 		= require('mongoose'),
	io 				= {},
	server 			= {},
	socketConfig 	= {},
	expressSession 	= {},
	optsBrowserify 	= {};

module.exports = function(config, db) {
	// Initialize express app
	var app = express();

	// Globbing model files
	config.getGlobbedFiles(config.appPaths.models).forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Config browserify to share files into client side
	// fs.mkdirSync('public/lib/bundle');
	optsBrowserify = {
		basedir: 'app'
	};
	browserify = browserify(optsBrowserify);
	browserify = browserify.add(config.assets.serverFiles);
	browserify.bundle().pipe(fs.createWriteStream('public/lib/bundle/bundle.js'));

	// Setting application local variables
	app.locals.title 			= config.app.title;
	app.locals.description 		= config.app.description;
	app.locals.keywords 		= config.app.keywords;
	app.locals.facebookAppId 	= config.facebook.clientID;
	app.locals.jsFiles 			= config.getJavaScriptAssets();
	app.locals.cssFiles 		= config.getCSSAssets();

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});

	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Showing stack errors
	app.set('showStackError', true);

	// Set swig as the template engine
	app.engine(config.viewsSuffix, consolidate[config.templateEngine]);

	// Set views path and view engine
	app.set('view engine', config.viewsSuffix);
	app.set('views', config.appPaths.serverViews);

	// Environment dependent middleware
	if (process.env.NODE_ENV === config.enviroments.development) {
		// Enable logger (morgan)
		app.use(morgan('dev'));

		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === config.enviroments.production) {
		app.locals.cache = 'memory';
	}

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Enable jsonp
	app.enable('jsonp callback');

	// CookieParser should be above session
	app.use(cookieParser());

	expressSession = session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			db: db.connection.db,
			collection: config.sessionCollection
		})
	});

	// Express MongoDB session storage
	app.use(expressSession);

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());
	
	// Start the app by listening on <port>
	server 	= app.listen(config.port);
	io 		= socketio.listen(server);

	// Init sockets config and share express session with 
	socketConfig 	= require('./socketio-config');
	socketConfig(io, expressSession);

	// connect flash for flash messages
	app.use(flash());

	// Use helmet to secure Express headers
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	//TODO validar contra una configuracion si puede cargar el archivo HTML de la vista segun el rol del usuario.
	// app.use('/modules/gamblermain/views/gamblermain.client.view.html', function(req, res, next){  
	//     var url = req.originalUrl;

	//     if(url === '/gamblermain/panel'){

	// 	    res.status(404).render('404', {
	// 			url: req.originalUrl,
	// 			error: 'Not Found'
	// 		});	
	//     }else{
	//     	next();
	//     }
	//     
	// });

	// Setting the app router and static folder
	app.use(express.static(path.resolve(config.appPaths.public)));

	// Globbing routing files
	config.getGlobbedFiles(config.appPaths.routes).forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).render('500', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

	return app;
};