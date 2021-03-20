
var modbus = require("modbus-stream");
const uri = "mongodb://localhost:27017/fortuna";
var MongoClient = require('mongodb').MongoClient;
var forEachL = require('async-foreach').forEach;

modbus.serial.connect("COM1", {
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    debug: "automaton-0"
}, (err, connection) => {
    console.log('connected');
    setInterval(function(){ 
     read();
    }, 15000);    
    function read() {
        MongoClient.connect(uri, function (err, db) {
            if (err) console.log(err);
            db.collection("site_blocks").find({ "is_deleted": false }).toArray(async function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    let externalResponse = await externalfnc(result, connection,db);
                }
            });
        });
    }
})

function externalfnc(resultDetails, connection,db) {    
    return new Promise(function (resolve, reject) {
        let extArr = [];
        async function forEachLoop(i) {
            if (i < resultDetails.length) {
                var detailsArray = resultDetails[i];  
                let internalResponse = await internalFnc(detailsArray, connection,db);  
                extArr.push(internalResponse)
                forEachLoop(i + 1);
            } else {
                return resolve(extArr);
            }
        }
        forEachLoop(0);
    });
}

function internalFnc(detailsArray, connection,db) {    
    return new Promise(function (resolve, reject) {
        let intArr = [];
        async function forEachLoop(j) {
            if (j < detailsArray.details.length) {
                connection.readHoldingRegisters({ address: detailsArray.details[j].register_address, quantity: 1, extra: {slaveId: detailsArray.details[j].slave_id, retry: 500000}}, function (err, info) {
                    if (err != null) {
                        console.log(err);
                    } else if (info != null) {
                        let value = info.response.data[0].readInt16BE(0);
                        db.collection("site_blocks").update({"_id" : detailsArray._id},{$set: {[`details.${j}.value`]: value}});
                        forEachLoop(j + 1);
                    }
                });   
            } else {
                return resolve(intArr);
            }
        }
        forEachLoop(0);
    });
}