var express = require('express');
var router = express.Router();

var mongo = require('mongoclientsingle');
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
passport.use(new LocalStrategy(
    function(username, password, done)
    {
        var doc = db.collection('users').find({ username: username }).toArray(
        
            function(err, data)
            {
                if (err) return done(null, false);
                else if (password != data[0].password) return done(null, false);
                else
                {
                    console.log(data[0]);
                    var user = { username: username, id: data[0]._id };
                    return done(null, user);
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

/* GET home page. */
router.get('/', function(req, res, next) 
{
    var name;
    try
    {
        name = req.user.username;
    }
    catch (e)
    {
        name = 'to the site';
    }
    res.render('index', { title: 'Notes', name: name });
});

router.get('/login', function(req, res)
{
    res.render('login');
});

router.get('/logout', function(req, res)
{
    req.session.destroy(function(err)
    {
        console.error('Failed to destroy session: %s', err);
        res.redirect('/');
    });
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), function(req, res)
{
    res.redirect('/'); 
});

module.exports = router;
