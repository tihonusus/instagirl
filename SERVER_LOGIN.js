var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongodb = require("mongodb");
var objectId = require('mongodb').ObjectID;

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/user_login';

mongoose.connect(url);

//dsadsa 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));


var Schema = mongoose.Schema;

var DataSchema = new Schema({
    Email: String
});


// Mongoose Model definition

var User = mongoose.model('data', DataSchema);

app.get('/', function (req, res) {
    res.send("<a href='/data'>Show Users</a>");
});

app.get('/data', function (req, res) {
    User.find({}, function (err, docs) {
    	res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(docs));
    });
});





// app.get('/data/:id', function (req, res) {
//     if (req.params.id) {
//         User.find({ id: req.params.id }, function (err, docs) {
//             res.json(docs);
//         });
//     }
// });

// dsdsd
MongoClient.connect(url, function(err, db){
	if(err){
		console.log("Unable to connect to the mongodb server");
	}else{
		console.log("Connect Successful", url);
		collection = db.collection("users");
	}
});


http.listen(3000, function(){
	console.log("listen on *:3000");
});


//ket noi bang socket
io.on("connection", function(socket){
	//lang nghe su kien login
	socket.on("login", function(email, password){
		console.log(email + "login");
		var cursor = collection.find({email:email});
		cursor.each(function(err, doc){
			if(err){
				console.log(err);
				socket.email("login", false);
			}else{
				if(doc != null){
					socket.emit("login", true);
				}else{
					socket.emit("login", false);
				}
			}
		});
	});

});


io.on("connection", function(socket){
socket.on('register', function (name, email, password ) {
    console.log(name + "register");
 
    var user = {name: name, email: email, password: password };
 
    collection.insert(user, function (err, result) {
      if (err) {
         console.log(err);
         socket.emit('register', false);
      } else {
          console.log('Inserted new user ok');
          socket.emit('register', true);
      }
      });
  });
});

MongoClient.connect(url, function(err, db){
	io.on("connection", function(socket){
		socket.on('insert', function (title, age, image, facebook, instagram) {
	    console.log(title + "insert");
	 
	    var item = {title: title, age: age, image:image, facebook: facebook, instagram:instagram };

	    var id = id;
	 
	    db.collection('datas').insertOne(item, function (err, result) {
	      if (err) {
	         console.log(err);
	         socket.emit('insert', false);
	      } else {
	          console.log('insert ok');
	          socket.emit('insert', true);
	      }
	      });
	  });
	});
});

MongoClient.connect(url, function(err, db){
	io.on("connection", function(socket){
		socket.on('update', function (id, name, age, image, facebook, instagram) {
	    console.log(name + "update");
	 
	    var item = {title: name, age: age, image: image, facebook: facebook, instagram:instagram };

	    var id = id;
	 
	    db.collection('datas').updateOne({"_id": objectId(id)}, {$set: item }, function (err, result) {
	      if (err) {
	         console.log(err);
	         socket.emit('update', false);
	      } else {
	          console.log('Update ok');
	          socket.emit('update', true);
	      }
	      });
	  });
	});
});


