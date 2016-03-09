/**
 * Primary routing for the user content.  Will contain the database logic for simplicity.
 * 
 * Notes will be stored as follows:
 * {
 *      _id:        Default,
 *      username:   The username of the person who submitted the note    
 *      date:       Date the note was submitted
 *      note:       Message body of the note provided by user
 * }
 */

var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var mongo = require('../mongoclientsingle');
var db;
mongo.db(function(database)
{
    db = database;
});

//Get application root directory
var path = require('path');
var root = path.resolve(__dirname,'..');
var static = root + '/static';

//Middleware to check authentication
var isAuthenticated = function(req, res, next) 
{
    if (req.isAuthenticated()) return next();
    res.redirect('/login.html');
}

/**
 * url: /notes
 * 
 * Central page to display all of the user's notes.
 * This should feed the user an html page which will pull the data on its own using /read
 */
router.get('/', isAuthenticated, function(req,res)
{
    res.sendFile(static + '/notes.html');
});

/**
 * Method to return all of a user's notes from the database
 */
router.get('/read', isAuthenticated, function(req, res)
{
    //Search database for all notes by the user sorted by date
    db.collection('notes').find({username: req.user.username}).sort({date:1}).toArray(function(err, data)
    {
        if (err)
        {
            console.error("/routes/notes.js error in request '/notes': " + err);
            //Replace the error with a user friendly error page later
            res.status(500).send('500: Internal Server Error\nPlease try again.');
            //res.status(500).sendFile('error.html');    
        }
        else
        {
            //Provide the data
            res.status(200).send(data);
        }
    });
});

/**
 * Method to submit a new note from a user
 */
router.post('/add', isAuthenticated, function(req, res)
{
    try
    {
        var submission = 
        {
            username: req.user.username,
            date: new Date().getTime(),
            note: req.body.note
        };
        
        //Insert new note into the database
        db.collection('notes').insertOne(submission, function(err, data)
        {
            if (err || data == null)
            {
                console.error("/routes/notes.js error in request '/notes/add': " + err);
                data.status(500).send('Database error.');
            }
            else res.status(201).redirect('/notes');
        });
    }
    //If this happens double check the form submission and express body parsing
    catch (e)
    {
        console.error("/routes/notes.js error in request '/notes/add': " + e);
        res.status(500).send('Check form formatting.');
    }
});

/**
 * Method to delete a note from a provided note object's _id
 */
router.post('/delete', isAuthenticated, function(req, res)
{
    var id = req.body._id;
    if (id == null) res.status(400).send('Invalid request.');
    else
    {
        db.collection('notes').remove({_id: new mongodb.ObjectID(id)}, function(err, data)
        {
           if (err) res.status(500).send('DB error.');
           else res.status(200).redirect('/notes'); 
        });
    }
});

module.exports = router;