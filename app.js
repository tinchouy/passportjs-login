var express = require('express');
var routes = require('./routes');

var path = require('path');
var favicon = require('serve-favicon');
    
var mongoose = require('mongoose');
var passport = require('passport');
    
require('./models/user');
require('./passport')(passport);

mongoose.connect('mongodb://localhost:27017/passport-example', function(err, res) {
  if(err) throw(err);
  console.log('Conectado a la BD con éxito');
});

var app = express();

app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(express.logger('dev'));

app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.session({ secret: 'wtf' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

if('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/salir', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', 
{ successRedirect: '/', failureRedirect: '/login'}
));
app.get('/auth/facebook/callback', passport.authenticate('facebook', 
{ successRedirect: '/', failureRedirect: '/login'}
));

app.listen(app.get('port'), function() {
  console.log('Aplicacion Express escuchando el puerto' + app.get('port'))
});

module.exports = app;
