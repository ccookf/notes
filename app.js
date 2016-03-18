var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Authentication and session store includes, setup session store
var passport = require('passport');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore(
{
    uri: 'mongodb://localhost:27017/notes',
    collection: 'sessions'
});

var routes = require('./routes/index');
var notes = require('./routes/notes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Passport authorization middleware
var hour = 1000 * 60 * 60;
app.use(session({
    resave: true,
    saveUnitialized: false,
    secret: 'NoteToSelfGetAProperSecretGeneratorInHereLater', //Kind of pointless on a public repo
    cookie: { httpOnly: true, secure: true, maxAge: hour },
    store: store,
    rolling: true
}));
app.use(passport.initialize());
app.use(passport.session());

// app.get('*', function(req, res, next)
// {
//     console.log('HTTPS request.');
//     next();
// });

app.use('/', routes);
app.use('/notes', notes);
app.use(express.static(__dirname + '/static'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  
  if (err.status == 404) res.status(404).sendFile(__dirname + '/static/404.html');
  else res.status(500).sendFile(__dirname + '/static/error.html');
  
  //Auto generated error handler
  /* res.render('error', {
    message: err.message,
    error: {}
  }); */ 
});


module.exports = app;
