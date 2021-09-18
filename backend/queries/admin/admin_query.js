var mongoose = require("mongoose");
var Admin = mongoose.model("admins");
var crypto = require("crypto");

let obj = {}

// Method to check login details of admin
obj.checkLogin = (data) => {
    return new Promise((resolve, reject) => {
        Admin.findOne(
            {
                email: data.email,
                is_deleted: false
            },
            function (err, user) {
                if (err) {
                    reject(err);
                }
                if (!user) {
                    resolve({ status: 404, msg: "Invalid Email" });
                }

                if (user) {
                    if (!user.is_active) {
                        resolve({ status: 404, msg: "In-Active user" });
                    }
                    //var password = userData.password
                    var password = crypto
                        .pbkdf2Sync(data.password, user.salt, 1000, 64, "sha512")
                        .toString("hex");
                    Admin.findOne({ email: data.email, password: password }, function (
                        err,
                        userlogin
                    ) {
                        if (err) {
                            reject(err);
                        }
                        if (!userlogin) {
                            resolve({
                                status: 404,
                                msg: "Wrong Password"
                            });
                        }
                        if (userlogin) {
                            var c = {
                                _id: userlogin._id,
                                first_name: userlogin.first_name,
                                last_name: userlogin.last_name,
                                email: userlogin.email,
                                phone: userlogin.phone,
                                user_type: userlogin.user_type,
                                selectedSites: userlogin.selectedSites
                            };
                            resolve({
                                status: 200,
                                admindata: c,
                                token: userlogin.generateJwt()
                            });
                        }
                    });
                }
            });
    });
}

// Method to check login details of admin
obj.resetPwdAdmin = (data) => {
    return new Promise((resolve, reject) => {
        // connection.query('update admins set password = ? where email = ?', [data.password, data.email], function (err, data) {
        //     if (err) reject(err);
        //     else resolve(data);
        // });
        let uData = { password: data.password };
        Admin.update(
            { email: data.email },
            { $set: uData }
        ).then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
    })
}

// Method to check login details of admin
obj.updateAccount = (data) => {
    return new Promise((resolve, reject) => {
        let updatedData = Object.assign({}, data);
        delete updatedData.new_password;
        delete updatedData.confirm_password;
        delete updatedData.id;
        Admin.findByIdAndUpdate(data.id, updatedData)
            .then(function (response) {
                var c = {
                    _id: response._id,
                    first_name: updatedData.first_name,
                    last_name: updatedData.last_name,
                    email: updatedData.email,
                    phone: updatedData.phone
                };
                resolve({
                    admindata: c,
                    token: response.generateJwt()
                });
            })
            .catch(function (error) {
                reject(301);
            });
    })
}

// Method to check login details of admin
obj.getAllUsers = (searchVal) => {
    return new Promise((resolve, reject) => {
        let sqlQuery;
        if (searchVal != "") {
            sqlQuery = "select * from users where first_name like '%" + searchVal + "%' OR last_name like '%" + searchVal + "%' OR email like '%" + searchVal + "%' and is_deleted = 0 ORDER BY id DESC"
        } else {
            sqlQuery = "select * from users where is_deleted = 0 ORDER BY id DESC"
        }
        connection.query(sqlQuery, function (err, data) {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

// Method to check login details of admin
obj.addUserData = (data) => {
    return new Promise((resolve, reject) => {
        connection.query('insert into users (first_name, last_name, email, password, phone, image, access_type)values(?,?,?,?,?,?)', [data.first_name, data.last_name, data.email, data.password, data.phone, data.image, data.access_type], (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

// Method to check login details of admin
obj.updateUserData = (data) => {
    return new Promise((resolve, reject) => {
        connection.query('update users set first_name = ?, last_name = ?, email = ?, phone = ?, image = ?, access_type = ? where id = ?', [data.first_name, data.last_name, data.email, data.phone, data.image, data.access_type, data.id], function (err, data) {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

// Method to check login details of admin
obj.getUserData = (data) => {
    return new Promise((resolve, reject) => {
        connection.query('select * from users where id = ' + data.ownerId, function (err, data) {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

// Method to check login details of admin
obj.deleteUserData = (data) => {
    return new Promise((resolve, reject) => {
        connection.query('update users set is_deleted = 1 where id IN (?)', [data.records], function (err, data) {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

// Method to check login details of admin
obj.changeActivationUserData = (data) => {
    return new Promise((resolve, reject) => {
        connection.query('update users set is_blocked = ? where id = ?', [data.is_blocked, data.ownerId], function (err, data) {
            if (err) reject(err);
            else resolve(data);
        })
    })
}

module.exports = obj;