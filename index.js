const express = require('express');
const path = require('path');

const config = require('./config.js');
const sitemap = require('./sitemap');

let app = express();

// middleware
let logger = require('morgan');
let bodyParser = require('body-parser');
let serveStatic = require('serve-static');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(serveStatic(path.join(__dirname, config.staticFolder), {'index': ['index.html', 'index.htm']}));

// error handling
app.use(function(req, res, next){
	res.status(404);
	console.error('Not found URL: %s', req.url);
	res.json({ error: 'Not found' });
});
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	console.error('Internal error(%d): %s', res.statusCode, err.message);
	res.json({ error: err.message });
});

// Starting server
app.listen(config.port, function(){
	console.log('Server started at port ' + config.port);
});
