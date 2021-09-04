var modbus = require("modbus-stream");
// const { Worker } = require('worker_threads');
const { fork } = require('child_process');
const moment = require('moment');
const uri = "mongodb://localhost:27017/fortuna";
const mongoose = require('mongoose');
const ObjectId = require("mongoose").Types.ObjectId;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
var db = mongoose.connection;
db.on('connected', function () {
    console.log('Mongoose default connection open');
});
db.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});
db.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

modbus.tcp.server({ debug: null }, (connection) => {
    console.log('Connected');
    // console.log("server====>",connection.readDeviceIdentification);
    
    setTimeout(function () {
        read();
    }, 5000);
    function read() {
        let aggregateQuery = [];
        let query = { "is_deleted": false };
        aggregateQuery.push({ $match: query });
        aggregateQuery.push({
            $lookup: {
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
                if (result.length > 0) {
                    const THREADS_AMOUNT = result.length;
                        (function () {
                            const promises = [];
                        for (let idx = 0; idx < THREADS_AMOUNT; idx += 1) {
                            promises.push(new Promise((resolve) => {
                                console.log('SITE NAME : ',result[idx].name);
                                var myFunc = connection.readHoldingRegisters;
                                const forked = fork('client.js', [], { silent: true, detached :true });
                                forked.on('message', async (data) => {
                                    let mimicsData = data.site.mimic_data;
                                    let meterData = data.site.meter_data;
                                    let siteBlocks = data.site.site_blocks;
                                    let externalResponseMeter = await internalFnc(data.site._id, meterData, connection, 0);
                                    let externalResponseBlock = await externalfnc(data.site._id, siteBlocks, connection, 1);
                                    let externalResponseMimic = await internalFnc(data.site._id, mimicsData, connection, 2);
                                });
                                forked.send({ idx, site: result[idx], connection: myFunc.toString() });
                                // const worker = new Worker('./client.js', { workerData: { idx, site: result[idx] } });
                                // worker.on('message', async (data) => {
                                //     console.log(data.name);
                                //     let mimicsData = data.mimic_data;
                                //     let meterData = data.meter_data;
                                //     let siteBlocks = data.site_blocks;
                                //     let externalResponseMeter = await internalFnc(data._id, meterData, connection, 0);
                                //     let externalResponseBlock = await externalfnc(data._id, siteBlocks, connection, 1);
                                //     let externalResponseMimic = await internalFnc(data._id, mimicsData, connection, 2);
                                // });
                                // worker.on('error', (error) => {
                                //     console.log(`Worker error `, error);
                                // })
                                // worker.on('exit', (code) => {
                                //     if (code !== 0)
                                //         console.log(`Worker stopped with exit code ${code}`);
                                // })
                            }))
                        }
                        // Handle the resolution of all promises
                        return Promise.all(promises);
                    })().then(() => {
                        canRun = false;
                    })
                }
            }
        });
    }
    
    function externalfnc(siteId, resultDetails, connection, db, type) {
        return new Promise(function (resolve, reject) {
            let extArr = [];
            async function forEachLoop(i) {
                if (i < resultDetails.length) {
                    var detailsArray = resultDetails[i];
                    let internalResponse = await internalFnc(siteId, detailsArray, connection, db, type);
                    extArr.push(internalResponse)
                    forEachLoop(i + 1);
                } else {
                    // console.log(extArr);
                    historyPumpData(siteId,extArr)
                    return resolve(extArr);
                }
            }
            forEachLoop(0);
        });
    }
    function internalFnc(siteId, detailsArray, connection, type) {
        return new Promise(function (resolve, reject) {
            let intArr = [];
            let meterDataResponse = [];
            let flowDataResponse = [];
            let levelDataResponse = [];
            let pumpDataResponse = [];
            async function forEachLoop(j) {
                if (type == 0 && j < detailsArray.length) {
                    if (typeof detailsArray[j].register_address !== 'undefined' && detailsArray[j].register_address) {
                        const response = await readHoldingRegisters(detailsArray[j], 1, detailsArray[j].slave_id, detailsArray[j].data_type.toLowerCase().replace(/\s/g, ''), type, siteId, j);
                        if (response)
                            meterDataResponse.push(response);
                        if (j == detailsArray.length - 1) {
                            //console.log('meterDataResponse', meterDataResponse)
                            await historyMeterData(siteId, meterDataResponse);
                            return resolve(true);
                        }
                        forEachLoop(j + 1);
                    }
                    else
                        forEachLoop(j + 1);
                }
                else if (type == 1 && j < detailsArray.details.length) {
                    if (typeof detailsArray.details[j].register_address !== 'undefined' && detailsArray.details[j].register_address) {
                        let response ='';
                        if (detailsArray.details[j].register_type == '1') {
                            response = await readDiscreteInputs(detailsArray.details[j], 1, detailsArray.details[j].slave_id, type, siteId, j,detailsArray._id);
                        }
                        else {
                            response = await readHoldingRegisters(detailsArray.details[j], 1, detailsArray.details[j].slave_id, detailsArray.details[j].data_type.toLowerCase().replace(/\s/g, ''), type, siteId, j,detailsArray._id);
                        }
                        if (response)
                            pumpDataResponse.push(response);
                        // return resolve(response)
                        if (j == detailsArray.details.length - 1) {
                            // console.log('pumpDataResponse', pumpDataResponse)
                            // await historyPumpData(siteId, pumpDataResponse);
                            return resolve(pumpDataResponse);
                        }
                        forEachLoop(j + 1);
                    }
                    else
                        forEachLoop(j + 1);
                }
                else if (type == 2 && j < detailsArray.length) {
                    if (typeof detailsArray[j].register_address !== 'undefined' && detailsArray[j].register_address) {
                        //console.log("mimic Register ", detailsArray[j].register_address);
                        let response ='';
                        if (detailsArray[j].register_type == '1') {
                            response = await readDiscreteInputs(detailsArray[j], 1, detailsArray[j].slave_id, type, siteId, j);
                        }
                        else {
                            response = await readHoldingRegisters(detailsArray[j], 1, detailsArray[j].slave_id, detailsArray[j].data_type.toLowerCase().replace(/\s/g, ''), type, siteId, j);
                        }
                        if (response){
                            if (detailsArray[j].category == 'Flow Meter')
                                flowDataResponse.push(response)
                            else
                                levelDataResponse.push(response)
                        }
                        if (j == detailsArray.length - 1) {
                            //console.log('flowDataResponse', flowDataResponse)
                            await historyFlowData(siteId, flowDataResponse);
                            await historylevelData(siteId, levelDataResponse);
                            return resolve(true);
                        }
                        forEachLoop(j + 1);
                    }
                    else
                        forEachLoop(j + 1);
                }
                else if (type == 3 && j < detailsArray.schedule_blocks.length) {
                    console.log('schedule write');
                    let writeData1 = Buffer.alloc(4);
                    writeData1.writeUInt16BE(detailsArray.schedule_blocks[j].startHour, 0);
                    console.log(writeData1);
                    console.log(detailsArray.schedule_blocks[j].startHourSlaveId);
                    connection.writeSingleRegister({ address: detailsArray.schedule_blocks[j].startHourRegister, values: writeData1, extra: { slaveId: detailsArray.schedule_blocks[j].startHourSlaveId, retry: 500000 } }, (err, info) => {
                        // connection.writeMultipleRegisters({ address: detailsArray.schedule_blocks[j].startHourRegister, values: [writeData1], extra: { slaveId: detailsArray.schedule_blocks[j].startHourSlaveId, retry:500000 } }, (err, info) => {
                        if (err) console.log(err);
                        if (info && info.response)
                            console.log("response write1", info.response);
                        let writeData2 = Buffer.alloc(4);
                        writeData2.writeUInt16BE(detailsArray.schedule_blocks[j].startMinute, 0)
                        connection.writeSingleRegister({ address: detailsArray.schedule_blocks[j].startMinuteRegister, values: writeData2, extra: { slaveId: detailsArray.schedule_blocks[j].startMinuteSlaveId, retry: 500000 } }, (err, info) => {
                            if (err) console.log(err);
                            if (info && info.response) console.log("response write2", info.response);
                            let writeData3 = Buffer.alloc(4);
                            writeData3.writeUInt16BE(detailsArray.schedule_blocks[j].endHour, 0)
                            connection.writeSingleRegister({ address: detailsArray.schedule_blocks[j].endHourRegister, values: writeData3, extra: { slaveId: detailsArray.schedule_blocks[j].endHourSlaveId, retry: 500000 } }, (err, info) => {
                                if (err) console.log(err);
                                if (info && info.response) console.log("response write3", info.response);
                                let writeData4 = Buffer.alloc(4);
                                writeData4.writeUInt16BE(detailsArray.schedule_blocks[j].endMinute, 0)
                                connection.writeSingleRegister({ address: detailsArray.schedule_blocks[j].endMinuteRegister, values: writeData4, extra: { slaveId: detailsArray.schedule_blocks[j].endMinuteSlaveId, retry: 500000 } }, (err, info) => {
                                    if (err) console.log(err);
                                    if (info && info.response) console.log("response write4", info.response);
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
    function readHoldingRegisters(data, quantity, slaveId, dataType, blockType, siteId, index,blockId=null) {
        return new Promise(function (resolve) {
            // setTimeout(function () {
            connection.readHoldingRegisters({ address: data.register_address, quantity: quantity, extra: { unitId: slaveId, retry: 500000 } }, (err, info) => {
            // connection.readHoldingRegisters({ address: data.register_address, quantity: quantity, extra: { unitId: slaveId } }, (err, info) => {
                if (err != null) {
                    console.log(err);
                    resolve(null);
                } else if (info != null) {
                    if (dataType != 'float') {
                        let value = readInteger(info);
                        if (data.division_factor) {
                            value = parseFloat(value / data.division_factor).toFixed(2);
                        }
                        console.log("Reading Integer " + slaveId +"::"+ data.register_address + " : ", value);
                        if (blockType == 0 && parseInt(value) >= 0)
                            db.collection("sites").updateOne({ "_id": ObjectId(siteId) }, { $set: { [`meter_data.${index}.value`]: value } });
                        else if (blockType == 1 && parseInt(value) >= 0)
                            db.collection("site_blocks").updateOne({ "_id": ObjectId(blockId) }, { $set: { [`details.${index}.value`]: value, [`updated_at`]: new Date() } });
                        else if (blockType == 2 && parseInt(value) >= 0)
                            db.collection("sites").updateOne({ "_id": ObjectId(siteId) }, { $set: { [`mimic_data.${index}.value`]: value } });
                        let valueUnit = value + " " + data.unit;
                        resolve({ [data.name]: valueUnit });
                    }
                    else {
                        readfloat(info).then(
                            function (value) {
                                if (data.division_factor) {
                                    value = parseFloat(value / data.division_factor).toFixed(2);
                                }
                                console.log("Reading float "+ slaveId +"::" + data.register_address + " : ", value);
                                if (blockType == 0 && parseFloat(value) >= 0)
                                    db.collection("sites").updateOne({ "_id": siteId }, { $set: { [`meter_data.${index}.value`]: value } });
                                else if (blockType == 1 && parseInt(value) >= 0)
                                    db.collection("site_blocks").updateOne({ "_id": blockId }, { $set: { [`details.${index}.value`]: value, [`updated_at`]: new Date() } });
                                else if (blockType == 2 && parseInt(value) >= 0)
                                    db.collection("sites").updateOne({ "_id": siteId }, { $set: { [`mimic_data.${index}.value`]: value } });
                                let valueUnit = value + " " + data.unit;
                                resolve({ [data.name]: valueUnit })
                            },
                            function (error) { console.log("Error ", error); }
                        );
                    }
                }
            });
            // }, 10);
        });
    }
    async function readDiscreteInputs(data, quantity, slaveId, blockType, siteId, index,blockId=null) {
        return new Promise(function (resolve) {
            // setTimeout(function () {
            connection.readDiscreteInputs({ address: data.register_address, quantity: quantity, extra: {unitId: slaveId, retry: 500000}}, function (err, info) {
               if (err != null) {
                    console.log(err);
                    resolve(null);
                } else if (info != null) {
                    let value = '';
                    value = info.response.data[0];
                    console.log("Reading " + slaveId +"::"+ data.register_address + " : ", value);
                    if (blockType == 1)
                        db.collection("site_blocks").updateOne({ "_id": ObjectId(blockId) }, { $set: { [`details.${index}.value`]: value, [`updated_at`]: new Date() } });
                    else if (blockType == 2)
                        db.collection("sites").updateOne({ "_id": ObjectId(siteId) }, { $set: { [`mimic_data.${index}.value`]: value } });
                    resolve({ [data.name]: value });
                }
            });
            // }, 10);
        });
    }

    async function historyMeterData(siteId, response) {
        // console.log("Log into history", siteId);
        return new Promise(function (resolve) {
            db.collection("site_datas").find({ site_id: ObjectId(siteId) }).sort({ _id: -1 }).limit(1).toArray(async function (err, result) {
                if (err) {
                    console.log(err);
                    resolve(true);
                } else {
                    const date = moment().format("DD/MM/YYYY");
                    const time = moment().format("HH:mm:ss");
                    if (result.length > 0) {
                        if(result[0].meterData && result[0].meterData.length > 0){
                            console.log("Insert meter history record");
                            let data = { site_id: ObjectId(siteId),  date: date, time: time, is_deleted: false, pumpData: [], meterData: response, levelData: [], flowData: [] };
                            db.collection("site_datas").insertOne(data);
                            resolve(true);
                        }
                        else if (JSON.stringify(result[0].meterData) !== JSON.stringify(response)) {
                            console.log("Update meter history record");
                            db.collection('site_datas').updateOne({ "_id": ObjectId(result[0]._id) }, { $set: { "meterData": response, "date": date, "time": time } })
                            .then((obj) => {
                                resolve(true);
                            })
                            .catch((err) => {
                                console.log('Error: ' + err);
                                resolve(true);
                            })
                        }
                       
                    }
                    else {
                        console.log("Insert meter history record");
                        let data = { site_id: ObjectId(siteId), date: date, time: time, is_deleted: false, pumpData: [], meterData: response, levelData: [], flowData: [] };
                        console.log(data);
                        db.collection("site_datas").insertOne(data);
                        resolve(true);
                    }
                }
            });
        });
    }

    async function historyPumpData(siteId, response) {
        // console.log("Log into history", response);
        return new Promise(function (resolve) {
            db.collection("site_datas").find({ site_id: ObjectId(siteId) }).sort({ _id: -1 }).limit(1).toArray(async function (err, result) {
                if (err) {
                    console.log(err);
                    resolve(true);
                } else {
                    const date = moment().format("DD/MM/YYYY");
                    const time = moment().format("HH:mm:ss");
                    if (result.length > 0) {
                        if(result[0].pumpData && result[0].pumpData.length > 0)
                        {
                            console.log("Insert pump data history record");
                            let data = { site_id: ObjectId(siteId),  date: date, time: time, is_deleted: false, pumpData: response, meterData: [], levelData: [], flowData: [] };
                            console.log(data);
                            db.collection("site_datas").insertOne(data);
                            resolve(true);
                        }
                        else{
                            console.log("Update pump data history record",result[0]._id);
                            db.collection('site_datas').updateOne({ "_id": ObjectId(result[0]._id) }, { $set: { "pumpData": response, "date": date, "time": time } })
                            .then((obj) => {
                                resolve(true);
                            })
                            .catch((err) => {
                                console.log('Error: ' + err);
                                resolve(true);
                            })
                        }
                       
                    }
                    else {
                        console.log("Insert pump data history record");
                        let data = { site_id: ObjectId(siteId), date: date, time: time, is_deleted: false, pumpData: response, meterData: [], levelData: [], flowData: [] };
                        console.log(data);
                        db.collection("site_datas").insertOne(data);
                        resolve(true);
                    }
                }
            });
        });
    }

    async function historyFlowData(siteId, response) {
        // console.log("Log into history", siteId);
        return new Promise(function (resolve) {
            db.collection("site_datas").find({ site_id: ObjectId(siteId) }).sort({ _id: -1 }).limit(1).toArray(async function (err, result) {
                if (err) {
                    console.log(err);
                    resolve(true);
                } else {
                    const date = moment().format("DD/MM/YYYY");
                    const time = moment().format("HH:mm:ss");
                    if (result.length > 0) {
                        if(result[0].flowData && result[0].flowData.length > 0){
                            console.log("Insert flowData history record");
                            let data = { site_id: ObjectId(siteId),  date: date, time: time, is_deleted: false, pumpData: [], meterData: [], levelData: [], flowData: response };
                            db.collection("site_datas").insertOne(data);
                            resolve(true);
                        }
                        else if (JSON.stringify(result[0].flowData) !== JSON.stringify(response)) {
                            console.log("Update flowData history record");
                            db.collection('site_datas').updateOne({ "_id": ObjectId(result[0]._id) }, { $set: { "flowData": response, "date": date, "time": time } })
                            .then((obj) => {
                                resolve(true);
                            })
                            .catch((err) => {
                                console.log('Error: ' + err);
                                resolve(true);
                            })
                        }
                       
                    }
                    else {
                        console.log("Insert flowData history record");
                        let data = { site_id: ObjectId(siteId), date: date, time: time, is_deleted: false, pumpData: [], meterData: [], levelData: [], flowData: response };
                        // console.log(data);
                        db.collection("site_datas").insertOne(data);
                        resolve(true);
                    }
                }
            });
        });
    }

    async function historylevelData(siteId, response) {
        // console.log("Log into history", siteId);
        return new Promise(function (resolve) {
            db.collection("site_datas").find({ site_id: ObjectId(siteId) }).sort({ _id: -1 }).limit(1).toArray(async function (err, result) {
                if (err) {
                    console.log(err);
                    resolve(true);
                } else {
                    const date = moment().format("DD/MM/YYYY");
                    const time = moment().format("HH:mm:ss");
                    if (result.length > 0) {
                        if(result[0].levelData && result[0].levelData.length > 0){
                            console.log("Insert levelData history record");
                            let data = { site_id: ObjectId(siteId),  date: date, time: time, is_deleted: false, pumpData: [], meterData: [], flowData: [], levelData: response };
                            db.collection("site_datas").insertOne(data);
                            resolve(true);
                        }
                        else if (JSON.stringify(result[0].levelData) !== JSON.stringify(response)) {
                            console.log("Update levelData history record");
                            db.collection('site_datas').updateOne({ "_id": ObjectId(result[0]._id) }, { $set: { "levelData": response, "date": date, "time": time } })
                            .then((obj) => {
                                resolve(true);
                            })
                            .catch((err) => {
                                console.log('Error: ' + err);
                                resolve(true);
                            })
                        }
                       
                    }
                    else {
                        console.log("Insert levelData history record");
                        let data = { site_id: ObjectId(siteId), date: date, time: time, is_deleted: false, pumpData: [], meterData: [], levelData: response, flowData: [] };
                        // console.log(data);
                        db.collection("site_datas").insertOne(data);
                        resolve(true);
                    }
                }
            });
        });
    }
    function readInteger(info) {
        // console.log("hexVal  ", info.response.data[0].toString("hex"));
        let value = info.response.data[0].readInt16BE(0);
        return value;
    }
    async function readfloat(info) {
        //read float value
        var hexVal = info.response.data[0].toString("hex");
        //console.log(hexVal);

        var str = '0x' + hexVal + '0000';
        // console.log("hexVal  ", hexVal);
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