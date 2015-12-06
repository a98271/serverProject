var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongodbURL = 'mongodb://ggg:ggg@ds059284.mongolab.com:59284/primer-dataset';
var mongoose = require('mongoose');

app.post('/',function(req,res) {
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://ggg:ggg@ds059284.mongolab.com:59284/primer-dataset');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		rObj.borough = req.body.borough;
		rObj.cuisine = req.body.cuisine;
		rObj.name = req.body.name;
		rObj.restaurant_id = req.body.restaurant_id;

		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		//console.log(r);
		r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant created!')
       		db.close();
			res.status(200).json({message: 'insert done', _id: r._id});
    	});
    });
});

app.delete('/restaurant_id/:id',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://ggg:ggg@ds059284.mongolab.com:59284/primer-dataset');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id}).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'delete done', restaurant_id: req.params.id});
    	});
    });
});
app.get('/restaurant_id/:id', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://ggg:ggg@ds059284.mongolab.com:59284/primer-dataset');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id},function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document', restaurnat_id:req.params.id});
			}
			db.close();
    	});
    });
});


app.get('/:field/:id', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://ggg:ggg@ds059284.mongolab.com:59284/primer-dataset');
	var db = mongoose.connection;
	var field = req.params.field;
	var id = req.params.id;
	
	var updateVal = {};
        updateVal[field] = id;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find(updateVal,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
    	});
    });
});
app.put('/restaurant_id/:id/grade', function(req,res) {
	
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://ggg:ggg@ds059284.mongolab.com:59284/primer-dataset');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		Restaurant.update({restaurant_id: req.params.id},{$push:{ "grades":{"date":req.body.date, "grade":req.body.grade, "score":req.body.score}}},function(err){
			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {
				db.close();
				res.status(200).json({message: 'update done'});
			}
		});
	});
});
app.put('/restaurant_id/:id/set/grade', function(req,res) {
	
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://ggg:ggg@ds059284.mongolab.com:59284/primer-dataset');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		Restaurant.update({restaurant_id: req.params.id},{$set:{ "grades":{"date":req.body.date, "grade":req.body.grade, "score":req.body.score}}},function(err){
			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {
				db.close();
				res.status(200).json({message: 'update done'});
			}
		});
	});
});

app.put('/restaurant_id/:id/set/:field/:item', function(req,res) {
	
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://ggg:ggg@ds059284.mongolab.com:59284/primer-dataset');
	var db = mongoose.connection;
	var field = req.params.field;
	var item = req.params.item;
	
	var updateVal = {};
        updateVal[field] = item;

	console.log(updateVal);
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		Restaurant.update({restaurant_id: req.params.id},{$set:updateVal},function(err){
			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {
				db.close();
				res.status(200).json({message: 'update done'});
			}
		});
	});
});

app.put('/restaurant_id/:id/set/address', function(req,res) {
	var criteria = {};
		if(req.body.building||req.body.street||req.body.zip)criteria.address = {};
		if(req.body.building)criteria.address.building = req.body.building;
		if(req.body.street)criteria.address.street = req.body.street;
		if(req.body.zipcode)criteria.address.zipcode = req.body.zipcode;
		
		if(req.body.lon||req.body.lat)criteria.address.coord = [];
		if(req.body.lon)criteria.address.coord.push(req.body.lon);
		if(req.body.lat)criteria.address.coord.push(req.body.lat);
		
		
	
	

	console.log(criteria);

	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://ggg:ggg@ds059284.mongolab.com:59284/primer-dataset');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);


		Restaurant.update({restaurant_id:req.params.id},{$set:criteria},function(err){
			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {
				db.close();
				res.status(200).json({message: 'update done'});
			}
		});
	});
});





app.put('/restaurant_id/:id/multipleset', function(req,res) {
	var criteria = {};
		if(req.body.building||req.body.street||req.body.zip)criteria.address = {};
		if(req.body.building)criteria.address.building = req.body.building;
		if(req.body.street)criteria.address.street = req.body.street;
		if(req.body.zipcode)criteria.address.zipcode = req.body.zipcode;
		
		if(req.body.lon||req.body.lat)criteria.address.coord = [];
		if(req.body.lon)criteria.address.coord.push(req.body.lon);
		if(req.body.lat)criteria.address.coord.push(req.body.lat);
		if(req.body.borough)criteria.borough = req.body.borough;;
		if(req.body.cuisine)criteria.cuisine = req.body.cuisine;
		if(req.body.name)criteria.name = req.body.name;
		if(req.body.restaurant_id)criteria.restaurant_id = req.body.restaurant_id;
	
	

	console.log(criteria);

	var restaurantSchema = require('./models/restaurant');
	mongoose.connect('mongodb://ggg:ggg@ds059284.mongolab.com:59284/primer-dataset');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);


		Restaurant.update({restaurant_id:req.params.id},{$set:criteria},function(err){
			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {
				db.close();
				res.status(200).json({message: 'update1 done'});
			}
		});
	});
});



app.listen(process.env.PORT || 8099);
