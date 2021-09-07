var modbus = require("modbus-stream");
modbus.tcp.server({ debug: null }, (connection) => {
    console.log('Connected');
    connection.readHoldingRegisters({ address: 6303, quantity: 1, extra: { unitId: 5, retry: 500000 } }, (err, info) => {
        if (err != null) {
            console.log(err);
        } else if (info != null) {
            console.log(info);
            // console.log(info.response.data[0].readInt16BE(0))
        }
    });
}).listen(1028, () => {
    console.log('server is running on 1028');
});