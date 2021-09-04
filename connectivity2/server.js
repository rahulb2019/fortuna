var modbus = require("modbus-stream");

modbus.tcp.server({ debug: "server" }, (connection) => {
    connection.readCoils({ address: 5, quantity: 8 }, (err, info) => {
        console.log("response", info.response.data);
    });
}).listen(1028, () => {
    modbus.tcp.connect(1028, { debug: "client" }, (err, connection) => {
        connection.on("read-coils", (request, reply) => {
            reply(null, [ 1, 0, 1, 0, 1, 1, 0, 1 ]);
        });
        connection.readCoils({ address: 5, quantity: 8 }, (err, info) => {
            console.log("response client ", info.response.data);
        });
       
    });
});