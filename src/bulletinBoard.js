var express = require('express');
var jade = require('jade');
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = "postgres://postgres:sergtsop@localhost:5432/postgres";

app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views','./src/views');
app.set('view engine','jade');

app.get('/', function(request, response){
	response.redirect('/post');
});

app.get('/messages',function(request, response){
	pg.connect(connectionString, function (err, client, done) {
		if(err){throw err;};
		client.query('select * from messages', function (err, result) {
			if(err){throw err;};
			allMessages = result.rows;
			allMessages = allMessages.reverse();
			response.render('messages',{allMessages: allMessages});
			done();
			pg.end();
		});
	});
});

app.get('/post',function(request, response){
	response.render('post');
});

app.post('/post',function(request, response){
	queryString = 'insert into messages (title, body) values (' + '\'' + request.body.messageTitle + '\',\'' + request.body.messageBody + '\'' + ');';
	
	pg.connect(connectionString, function (err, client, done) {
		client.query(queryString, function (err) {
			if(err){throw err;};
			response.redirect('/messages');
			done();
			pg.end();
		});
	});
});

var server = app.listen(3000, function () {
	console.log('bulletinBoard running on localhost:' + server.address().port);
});