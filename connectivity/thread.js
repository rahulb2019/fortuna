const JSONStream = require('JSONStream');
const { workerData, parentPort } = require('worker_threads')
// console.log('workerData',workerData);
console.log('connection',workerData.con);