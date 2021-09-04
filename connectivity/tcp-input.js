var modbus = require("modbus-stream");
modbus.tcp.server({ debug: null }, (connection) => {
    console.log('Connected');
    // console.log('connection',connection)
    // setInterval(function () {
    setTimeout(function () {
        read();
    }, 3000)
    // }, 15000);

    function read() {
        // connection.readDiscreteInputs({address: 2048, quantity: 1, extra: {unitId: 5, retry: 3000}}, function (err, info) {
        //     console.log("readDiscreteInputs");
        //     if (err != null) {
        //         console.log("Error",err);
        //     } else if (info != null) {
        //         // console.log(info.response);
        //         console.log("value: ",info.response.data);
        //     }
        // });
        connection.readHoldingRegisters({ address: 6327, quantity: 1, extra: { unitId: 5, retry: 3000 } }, function (err, info) {
            console.log("holding register");
            if (err != null) {
                console.log(err);
            } else if (info != null) {
                // console.log(info.response);
                console.log("value: ", info.response.data[0]);
                readfloat(info).then(
                    function (value) {
                        console.log("Value ", value);
                    },
                    function (error) { console.log("Error ", error); }
                );
            }
        });
    }
    async function readfloat(info) {
        //read float value
        var hexVal = info.response.data[0].toString("hex");
        //console.log(hexVal);

        var str = '0x' + hexVal + '0000';
        console.log("hexVal  ", hexVal);
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