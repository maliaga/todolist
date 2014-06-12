/**
 * Created by awunnenb on 07.06.14.
 */

// Module
var express = require('express');
var app = express();
var routes = require('./routes');
var http = require('http');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());         // pull information from html in POST
app.use(methodOverride());          // simulate DELETE and PUT

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    var morgan = require('morgan'); // log every request to the console
    var errorHandler = require('errorhandler');
    app.use(morgan('dev'));
    app.use(errorHandler());
}

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
