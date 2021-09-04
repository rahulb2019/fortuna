process.on('message', function(data) {
    process.send({ site: data.site });
});
// const {parentPort, workerData} = require("worker_threads");
// parentPort.postMessage(workerData.site);