var express = require('express');
var router = express.Router();

var mongo = require('../mongoclientsingle');
var db;
mongo.db(function(database)
{
    db = database;
});

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore(
{
    uri: 'mongodb://localhost:27017/notes',
    collection: 'sessions'
});



//Naive login, searches for the user and checks cleartext password against form data
passport.use(new LocalStrategy({passReqToCallback: true},
    function(req, username, password, done)
    {
        db.collection('users').find({ username: username }).toArray(function(err, data)
        {
            if (err) return done(null, false);
            else if (data.length == 0) return done(null, false);
            else if (password != data[0].password) return done(null, false);
            else
            {
                console.log(data[0]);
                var user = { username: username, id: data[0]._id };
                req.session.regenerate(function(err)
                {
                    if (err) console.log(err);
                    return done(null, user);
                });
            } 
        });
    }
));

//@todo setup id serialization, this is just a filler passthrough
passport.serializeUser(function(user,callback)
{
    callback(null, user);
});

passport.deserializeUser(function(user, callback)
{
    callback(null, user);
});

//Middleware to check authentication
var isAuthenticated = function(req, res, next) 
{
    if (req.isAuthenticated()) return next();
    res.redirect('/login.html');
}

/* GET home page. */
router.get('/', function(req, res, next) 
{
    if (req.isAuthenticated()) res.redirect('/notes');
    res.redirect('/home.html');
});

router.get('/login', function(req, res)
{
    res.redirect('/login.html');
});

router.get('/logout', function(req, res)
{
    req.session.destroy(function(err)
    {
        console.error('Failed to destroy session: %s', err);
        res.redirect('/');
    });
});

router.post('/login', passport.authenticate('local'),function(req, res)
{
    res.status(200).redirect('/notes');
});

router.post('/register', function(req, res)
{
    if (req.body.username == null || req.body.password == null)
    {
        console.log('null registration fields');
        res.status(400).end();
    }
    else
    {
        db.collection('users').find({ username: req.body.username }).toArray(function(err, data)
        {
            if (data.length > 0) res.status(400).send('Username is already taken.');
            else
            {
                db.collection('users').insert({ username: req.body.username, password: req.body.password }, function(err, data)
                {
                    if (err) res.status(400).send('DB error.');
                    else res.status(201).redirect('/notes');
                });
            }
        });
    }
});

module.exports = router;
