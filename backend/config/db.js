/**
Description : The file will take care of the database connectivity 
Author : Sachin Pundir
*/ 
	var bluebird = require('bluebird');

        var mongoose = require('mongoose');         
        
        mongoose.Promise = bluebird;   
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);  
        mongoose.set('useUnifiedTopology', true);

        // Connecting to local Database     
        if(process.env.NODE_ENV=='staging'){
          mongoose.connect(process.env.DB_STAGING);
        }else if(process.env.NODE_ENV=='live'){
          mongoose.connect(process.env.DB_LIVE);
        }else{
          mongoose.connect(process.env.DB_LOCAL);
        }  	
        
       	// Creating mongoose connection instance
        var db = mongoose.connection;

        // CONNECTION EVENTS

        // When successfully scheduleconnected
        db.on('connected', function () {  
          console.log('Mongoose default connection open');
        }); 

        // When the connection is disconnected
        db.on('disconnected', function () {  
          console.log('Mongoose default connection disconnected'); 
        });

        // If the connection throws an error
        db.on('error',function (err) {  
          console.log('Mongoose default connection error: ' + err);
        }); 

        // If the Node process ends, close the Mongoose connection 
        process.on('SIGINT', function() {  
          mongoose.connection.close(function () { 
            console.log('Mongoose default connection disconnected through app termination'); 
            process.exit(0); 
          }); 
        });
