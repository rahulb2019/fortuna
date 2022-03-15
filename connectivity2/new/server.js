var modbus = require("modbus-stream");

modbus.tcp.server({ debug: "server" }, (connection) => {
     connection.readHoldingRegisters({ address: 663, quantity: 1, extra: { unitId: 10, retry: 30000 } }, (err, info) => {
        if (err != null) {
            console.log("Data not receiving : ");
            console.log(err);
        } else if (info != null) {
            console.log(info);
        }
    });
}).listen(1028, () => {
    console.log('server is running on 1028');
});