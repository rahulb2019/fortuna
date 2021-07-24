var modbus = require("modbus-stream");
// const uri = "mongodb://admin:admin123@localhost:27017/fortuna?authSource=admin";
const uri = "mongodb://localhost:27017/fortuna";
var MongoClient = require('mongodb').MongoClient;


modbus.tcp.server({debug: null}, (connection) => {
    console.log('connected');
    setInterval(function () {
        read();
        //write();
    }, 15000);

    function read() {
        MongoClient.connect(uri, function (err, db) {
            if (err)
                console.log(err);
            let aggregateQuery = [];
            let query = {"is_deleted": false};
            aggregateQuery.push({ $match: query });
            aggregateQuery.push({ 
                $lookup:{
                            from: "site_blocks", // collection to join
                            localField: "_id",//field from the input documents
                            foreignField: "site_id",//field from the documents of the "from" collection
                            as: "site_blocks"// output array field
                        }
            });
            db.collection("sites").aggregate(aggregateQuery).toArray(async function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if(result.length >0){
						//console.log(result);
						let sites = await siteLoopfnc(result, connection, db);
						read();
						//write();
                    }
                }
            });
        });
    }
	function siteLoopfnc(result, connection, db) {
        return new Promise(function (resolve, reject) {
            let siteResponse = [];
            async function forEachLoop(i) {
                if (i < result.length) {
                    var site = result[i];
                    let mimicsData=site.mimic_data;
                    let meterData=site.meter_data;
                    let siteBlocks=site.site_blocks;
					//console.log(mimicsData);
					//if(i==1){
						console.log("SITE NAME : ",site.name);
						let externalResponseMeter = await internalFnc(site._id, meterData, connection, db, 0);
						let externalResponseBlock = await externalfnc(site._id, siteBlocks, connection, db, 1);
						let externalResponseMimic = await internalFnc(site._id, mimicsData, connection, db, 2);
					//}
                    siteResponse.push(site)
                    forEachLoop(i + 1);
                } else {
                    return resolve(siteResponse);
                }
            }
            forEachLoop(0);
        });
    }
    function write() {
        MongoClient.connect(uri, function (err, db) {
            if (err)
                console.log(err);
            db.collection("site_schedules").find({}).toArray(async function (err, result) {
            if (err) {
                    console.log(err);
                } else {
                    if(result.length >0){
                        let externalResponseBlock = await externalfnc(result[0]._id, result, connection, db, 3);
                    }
                }
            });
        });
    }
    function externalfnc(siteId, resultDetails, connection, db, type) {
        return new Promise(function (resolve, reject) {
            let extArr = [];
            async function forEachLoop(i) {
                if (i < resultDetails.length) {
                    var detailsArray = resultDetails[i];
                    let internalResponse = await internalFnc(siteId, detailsArray, connection, db,type);
                    extArr.push(internalResponse)
                    forEachLoop(i + 1);
                } else {
                    return resolve(extArr);
                }
            }
            forEachLoop(0);
        });
    }

    function internalFnc(siteId, detailsArray, connection, db, type) {
        return new Promise(function (resolve, reject) {
            let intArr = [];
            async function forEachLoop(j) {
                if(type==0 && j < detailsArray.length){
                    if (typeof detailsArray[j].register_address !== 'undefined' && detailsArray[j].register_address) {
						console.log('Meter data');
						console.log("Register ",detailsArray[j].register_address);
						connection.readHoldingRegisters({address: detailsArray[j].register_address, quantity: 1, extra: {unitId: detailsArray[j].slave_id, retry: 500000}}, function (err, info) {
							if (err != null) {
								console.log(err);
							} else if (info != null) {
								if(detailsArray[j].data_type.toLowerCase().replace(/\s/g, '')!='float')
								{
                                    let value = readInteger(info);
									console.log("Value ", value);
									db.collection("sites").update({"_id": siteId}, {$set: {[`meter_data.${j}.value`]: value}});
								}
                                else{
									readfloat(info).then(
									  function(value) { 
										console.log("Value =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   ", value);
										db.collection("sites").update({"_id": siteId}, {$set: {[`meter_data.${j}.value`]: value}});
									  },
									  function(error) { console.log("Error ", error); }
									);
                                    //value = readfloat(info);
								}
							}
							forEachLoop(j + 1);
						});
					}
					else
						forEachLoop(j + 1);
                }
                else if(type==1 && j < detailsArray.details.length){
                    //console.log(detailsArray.details[j]);
					if (typeof detailsArray.details[j].register_address !== 'undefined' && detailsArray.details[j].register_address) {
						console.log('Block');
						console.log("Register ",detailsArray.details[j].register_address);
						connection.readHoldingRegisters({address: detailsArray.details[j].register_address, quantity: 1, extra: {unitId: detailsArray.details[j].slave_id, retry: 500000}}, function (err, info) {
							if (err != null) {
								console.log(err);
							} else if (info != null) {
								if(detailsArray.details[j].data_type.toLowerCase().replace(/\s/g, '')!='float')
								{
                                    let value = readInteger(info);
									console.log("Value ", value);
									db.collection("site_blocks").update({"_id": detailsArray._id}, {$set: {[`details.${j}.value`]: value}});
								}
                                else{
									readfloat(info).then(
									  function(value) { 
										console.log("Value ", value);
										db.collection("site_blocks").update({"_id": detailsArray._id}, {$set: {[`details.${j}.value`]: value}});
									  },
									  function(error) { console.log("Error ", error); }
									);
                                    //value = readfloat(info);
								}
							}
							forEachLoop(j + 1);
						});
					}
					else
						forEachLoop(j + 1);
                }
                else if(type==2 && j < detailsArray.length){
                    //console.log('mimic data');
					//console.log(detailsArray[j]);
					//console.log(detailsArray[j].register_address);
                    if (typeof detailsArray[j].register_address !== 'undefined' && detailsArray[j].register_address) {
                        // the variable is defined
                        //console.log(j);
                        //console.log(detailsArray[j]);
						console.log("mimic Register ",detailsArray[j].register_address);
                        connection.readHoldingRegisters({address: detailsArray[j].register_address, quantity: 1, extra: {unitId: detailsArray[j].slave_id, retry: 500000}}, function (err, info) {
                            if (err != null) {
                                console.log(err);
                            } else if (info != null) {
                                if(detailsArray[j].data_type.toLowerCase().replace(/\s/g, '')!='float')
								{
                                    let value = readInteger(info);
									console.log("Value ", value);
									db.collection("sites").update({"_id": siteId}, {$set: {[`mimic_data.${j}.value`]: value}});
								}
                                else{
									readfloat(info).then(
									  function(value) { 
										console.log("Value ", value);
										db.collection("sites").update({"_id": siteId}, {$set: {[`mimic_data.${j}.value`]: value}});
									  },
									  function(error) { console.log("Error ", error); }
									);
                                    //value = readfloat(info);
								}
                                // let value = info.response.data[0].readInt16BE(0);
                                
								
                                
                            }
							forEachLoop(j + 1);
                        });
                    
                    }
					else
						forEachLoop(j + 1);
                }
                else if(type==3 && j < detailsArray.schedule_blocks.length){
                    console.log('schedule write');
                    let writeData1 = Buffer.alloc(4);
                    writeData1.writeUInt16BE(detailsArray.schedule_blocks[j].startHour, 0);
                    console.log(writeData1);
                    console.log(detailsArray.schedule_blocks[j].startHourSlaveId);
                    connection.writeSingleRegister({ address: detailsArray.schedule_blocks[j].startHourRegister, values: writeData1, extra: { slaveId: detailsArray.schedule_blocks[j].startHourSlaveId, retry:500000 } }, (err, info) => {
                    // connection.writeMultipleRegisters({ address: detailsArray.schedule_blocks[j].startHourRegister, values: [writeData1], extra: { slaveId: detailsArray.schedule_blocks[j].startHourSlaveId, retry:500000 } }, (err, info) => {
                        if (err) console.log(err);
                        if(info && info.response)
                            console.log("response write1", info.response);
                        let writeData2 = Buffer.alloc(4);
                        writeData2.writeUInt16BE(detailsArray.schedule_blocks[j].startMinute, 0)
                        connection.writeSingleRegister({ address: detailsArray.schedule_blocks[j].startMinuteRegister, values: writeData2, extra: { slaveId: detailsArray.schedule_blocks[j].startMinuteSlaveId, retry:500000 } }, (err, info) => {
                            if (err) console.log(err);
                            if(info && info.response) console.log("response write2", info.response);
                            let writeData3 = Buffer.alloc(4);
                            writeData3.writeUInt16BE(detailsArray.schedule_blocks[j].endHour, 0)
                            connection.writeSingleRegister({ address: detailsArray.schedule_blocks[j].endHourRegister, values: writeData3, extra: { slaveId: detailsArray.schedule_blocks[j].endHourSlaveId, retry:500000 } }, (err, info) => {
                                if (err) console.log(err);
                                if(info && info.response) console.log("response write3", info.response);
                                let writeData4 = Buffer.alloc(4);
                                writeData4.writeUInt16BE(detailsArray.schedule_blocks[j].endMinute, 0)
                                connection.writeSingleRegister({ address: detailsArray.schedule_blocks[j].endMinuteRegister, values: writeData4, extra: { slaveId: detailsArray.schedule_blocks[j].endMinuteSlaveId, retry:500000 } }, (err, info) => {
                                    if (err) console.log(err);
                                    if(info && info.response) console.log("response write4", info.response);
                                    forEachLoop(j + 1);
                                });
                            });
                        });
                    });
                } 
                else {
                    return resolve(intArr);
                }
            }
            forEachLoop(0);
        });
    }

    function readInteger(info){
		console.log("hexVal  " ,info.response.data[0].toString("hex"));
        let value = info.response.data[0].readInt16BE(0);
        return value;
    }
    async function readfloat(info){
		 //read float value
		var hexVal = info.response.data[0].toString("hex");
		//console.log(hexVal);
		
		var str = '0x' + hexVal + '0000';
		console.log("hexVal  " ,hexVal);
		//ecxit;
	    function parseFloat(str) {
			var float = 0, sign, order, mantiss, exp,
					int = 0, multi = 1;
			if (/^0x/.exec(str)) {
				int = parseInt(str, 16);
			} else {
				for (var i = str.length - 1; i >= 0; i -= 1) {
					if (str.charCodeAt(i) > 255) {
						console.log('Wrong string parametr');
						return false;
					}
					int += str.charCodeAt(i) * multi;
					multi *= 256;
				}
			}
			sign = (int >>> 31) ? -1 : 1;
			exp = (int >>> 23 & 0xff) - 127;
			mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
			for (i = 0; i < mantissa.length; i += 1) {
				float += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
				exp--;
			}
			return float * sign;
		}
		let value = await parseFloat(str);
		return value.toFixed(2);
    }
}).listen(1028, () => {
    console.log('server is running on 1028');
});