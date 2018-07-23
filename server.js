/*
NOTE: Most of this stuff was cribbed from here:
https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular

Use of FETCH was from here:
https://zellwk.com/blog/crud-express-and-mongodb-2/
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

A few notes on Mongoose & MongoDB were from here:
https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

*/


// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

//mongoose.connect('mongodb://dschneider:SmellyS0ckMan@ds243491.mlab.com:43491/questions_test');     // connect to mongoDB database

//Set up default mongoose connection
var mongoDB = 'mongodb://dschneider:SmellyS0ckMan@ds243491.mlab.com:43491/questions_test';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static(__dirname + '/public_html'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model =================
var Question = mongoose.model('questions', {
    content : String
});


// routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/question', function(req, res) {
        // use mongoose to get all todos in the database
        Question.find(function(err, questions) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                  res.send(err)
            }

            res.json(questions); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/question', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Question.create({
            content : req.body.content
        }, function(err, question) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Question.find(function(err, questions) {
                if (err)
                    res.send(err)
                res.json(questions);
            });
        });

    });

    // delete a todo
    app.delete('/api/question/:question_id', function(req, res) {
        Question.remove({
            _id : req.params.question_id
        }, function(err, question) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Question.find(function(err, questions) {
                if (err)
                    res.send(err)
                res.json(questions);
            });
        });
    });


// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendfile('./public_html/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});






// listen (start app with node server.js) ======================================
app.listen(process.env.PORT || 5000);
if(process.env.PORT) {
  console.log("Heroku version - listening on " + process.env.PORT)
} else {
    console.log("Local branch! Listening on 5000");
}
