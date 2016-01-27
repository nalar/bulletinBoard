// SET USER AND PASSWORD FOR THE DATABASE AS ENVIRONMENT VALUES

// Set the several requires
var express = require('express');
var sequelize = require('sequelize');
var jade = require('jade');
var pg = require('pg');
var bodyParser = require('body-parser');

// Set the connectionString variable
var connectionString = "postgres://postgres:sergtsop@localhost:5432/postgres";

// Settings for express
app = express();
app.use(bodyParser.urlencoded({
	extended: true
}));
app.set('views', './src/views');
app.set('view engine', 'jade');

// Settings for sequelize
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres', process.env.PSQL_USERNAME, process.env.PSQL_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres',
	define: {
		timestamps: false
	}
});

// Define message model for sequelize
var Message = sequelize.define('message', {
	title: Sequelize.TEXT,
	body: Sequelize.TEXT
})

app.get('/', function(request, response) {
	response.redirect('/post');
});

app.get('/messages', function(request, response) {
	Message.findAll().then(function(messages) {
		var data = messages.map(function(message) {
			return {
				title: message.dataValues.title,
				body: message.dataValues.body
			}
		})
		allMessages = data.reverse();
		response.render('messages', {
			allMessages: allMessages
		});
	})
});

app.get('/post', function(request, response) {
	response.render('post');
});

app.post('/post', function(request, response) {
	messageTitle = request.body.messageTitle;
	messageBody = request.body.messageBody;

	Message.create({
		title: messageTitle,
		body: messageBody
	});

	response.redirect('/messages');
});

sequelize.sync().then(function() {
	var server = app.listen(3000, function() {
		console.log('bulletinBoardSequelized running on localhost:' + server.address().port);
	});
});