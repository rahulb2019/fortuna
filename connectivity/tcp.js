var modbus = require("modbus-stream");
const uri = "mongodb://localhost:27017/fortuna";
var MongoClient = require('mongodb').MongoClient; 
 

modbus.tcp.server({debug: "server"}, (connection) => {
   console.log('connected');
   setInterval(function(){ 
        read(); 
    }, 15000);    
    function read(){
        MongoClient.connect(uri, function(err, db) {  
            if (err) console.log(err);  
            db.collection("site_blocks").find({"is_deleted" : false}).toArray(function(err, result) { 
              if (err) console.log(err); 
              result.forEach(element => { 
                if(element.details.length >0)
                {
                    element.details.forEach(function (blockData, i) {
                        connection.readHoldingRegisters({address: blockData.register_address, quantity: 1, extra: {unitId: blockData.slave_id, retry: 50000}}, (err, info) => {
                            if (err)
                                console.log(err);
                            if (info && info.response) {
                                let value=info.response.data[0].readInt16BE(0);
                                console.log(value);
                                db.collection("site_blocks").update({"_id" : element._id},{$set: {[`details.${i}.value`]: value}})
                            }
                        });
                    });
                }
              });   
            //   db.close();  
            });  
        });
    }
}).listen(1028, () => {
    console.log('server is running on 1028');
});