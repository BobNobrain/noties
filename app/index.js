const express = require('express');
const path = require('path');

const config = require('./config');
const sitemap = require('./sitemap');
const api = require('./server/api');

let app = express();

// middleware
let logger = require('morgan');
let bodyParser = require('body-parser');
let serveStatic = require('serve-static');

app.use(logger(config.NODE_ENV === 'prod'? 'tiny' : 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(serveStatic(path.join(path.dirname(__dirname), config.staticFolder), {'index': ['index.html', 'index.htm']}));

// register endpoints
api.serve(app);

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
	console.log(`A ${config.NODE_ENV} server started at port ${config.port}`);
});
