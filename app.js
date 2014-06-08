/**
 * Created by awunnenb on 07.06.14.
 */

// Module
var express = require('express');
var app = express();
var routes = require('./routes');
var http = require('http');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var morgan  = require('morgan')

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(morgan('dev'));             // log every request to the console
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());         // pull information from html in POST
app.use(methodOverride());          // simulate DELETE and PUT
app.use(errorHandler())

// Routes
app.get('/', routes.index);
app.get('/home', routes.index);
app.get('/new', routes.new);
app.get('/edit/:id', routes.edit);
app.get('/delete/:id', routes.delete);
app.get('/done/:id', routes.done);
app.post('/save/:id?', routes.save);
app.post('/remove/:id', routes.remove);

// Server
http.createServer(app).listen(app.get('port'), function(){
    console.log('App läuft auf Port '+ app.get('port'));
    console.log('URL: http://localhost:'+ app.get('port'));

});
