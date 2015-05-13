var mongoose = require('mongoose');
var User = mongoose.model('User');

var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var config = require('./config');

module.exports = function(passport) {
    passport.serializeUser(function(user, done){
        done(null, user);
    });
    passport.deserializeUser(function(obj, done){
        done(null, obj);
    });
    
    passport.use(new TwitterStrategy({
        consumerKey         :   config.twitter.key,
        consumerSecret      :   config.twitter.secret,
        callbackURL         :   '/auth/twitter/callback'
    }, function(acessToken, refreshToken, profile, done) {
        User.findOne({provider_id: profile.id}, function(err, user) {
            if(err) throw(err);
            
            if(!err && user != null) return done(null, user);
            
            var user = new User({
                provider_id     : profile.id,
                provider        : profile.provider,
                name            : profile.displayName,
                photo           : profile.photos[0].value
            });
            
            user.save(function(err) {
                if(err) throw(err);
                done(null, user);
            });
        });
    }));
    
    passport.use(new FacebookStrategy({
        clientID        : config.facebook.key,
        clientSecret    : config.facebook.secret,
        callbackURL     : '/auth/facebook/callback',
        profileFields  : ['id', 'displayName', 'provider', 'photo']
    }, function(accessToken, refreshToken, profile, done) {
        User.findOne({provider_id: profile.id}, function(err, user) {
            if(err) throw(err);
            
            if(!err && user != null) return done(null, user);
            
            var user = new User({
                provider_id     : profile.id,
                provider        : profile.provider,
                name            : profile.displayName,
                photo           : profile.photos[0].value
            });
            
            user.save(function(err) {
                if(err) throw(err);
                done(null, user);
            });
        });
    }));
};
