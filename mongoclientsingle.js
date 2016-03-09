/**
 * Usage:
 * 
 * 		var mongo = require('./mongoclientsingle.js');
 * 		mongo.db(function(db)
 * 		{
 * 			//do stuff with db here
 * 		})
 */
var client = Singleton();
module.exports = client;

function Singleton()
{
	var database;
	
	//Creates the database client and handler
	function createInstance(callback)
	{
		var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost:27017/notes';

		MongoClient.connect(url, function(error, db)
		{
			if (!db)
			{
				console.log("Mongodb not running");
				console.error("Terminating session, must run Mongodb first.");
				process.exit(1);
			}
			console.log("Connected to database.");
            database = db;
			callback(database);
		});
	}
	
	return {
		db: function (callback)
		{
			if (!database)
			{
				console.log("Mongoclient db not established, creating...");
				createInstance(function(db, dh)
				{
					callback(db);	
				});
			}
			else callback(database)
		}
	};
};