// Set the several requires
var express = require('express');
var jade = require('jade');
var pg = require('pg');
var bodyParser = require('body-parser');

// Set the connectionString variable
var connectionString = "postgres://postgres:sergtsop@localhost:5432/postgres";

// Settings for express
app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views','./src/views');
app.set('view engine','jade');

app.get('/', function(request, response){									// On get request for /
	response.redirect('/post');												// Redirect to the post page
});

app.get('/messages',function(request, response){							// On get request for /messages
	pg.connect(connectionString, function (err, client, done) {				// Connect to the database
		if(err){throw err;};												// Error handler
		client.query('select * from messages', function (err, result) {		// Query the database for * from table messages
			if(err){throw err;};											// Error handler
			allMessages = result.rows;										// Define allMessages
			allMessages = allMessages.reverse();							// Reverse so latest message is on top
			response.render('messages',{allMessages: allMessages});			// Render messages.jade with variable allMessages passed on
			done();															// Tell the database client that it's done
			pg.end();														// End the database connection
		});
	});
});

app.get('/post',function(request, response){								// On get request for /post
	response.render('post');												// Render post.jade
});

app.post('/post',function(request, response){								// On post request for /post, define the query string on line 39
	queryString = 'insert into messages (title, body) values (' +'\'' + request.body.messageTitle + '\',\'' + request.body.messageBody + '\'' + ');';
	
	pg.connect(connectionString, function (err, client, done) {				// Connect to the database
		client.query(queryString, function (err) {							
			if(err){throw err;};											// Error handler
			response.redirect('/messages');									// After doing the query, redirect to /messages
			done();															// Tell the database client that it's done
			pg.end();														// End the database connection
		});
	});
});

var server = app.listen(3000, function () {										// Let express listen on port 3000
	console.log('bulletinBoard running on localhost:' + server.address().port);	// Log that information
});