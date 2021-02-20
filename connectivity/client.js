var modbus = require("modbus-stream");
modbus.tcp.connect(1028, { debug: "client" }, (err, connection) => {
        connection.on("read-holding-registers", (request, reply) => {
            console.log('ok');
            return reply(null, [ Buffer.from([0,220])]);
        });
    });