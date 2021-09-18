var mongoose = require("mongoose");
var User = mongoose.model("admins");
var crypto = require("crypto");


exports.loginAdmin = function (req, res) {
    var userData = data ? data : {};
    //'email_status': true

};


// const connection = require('../../config/connection');
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
                                fname: userlogin.fname,
                                lname: userlogin.lname,
                                email: userlogin.email,
                                phone: userlogin.phone
                            };
                            resolve({
                                // status: 200,
                                // msg: "Login Successfully.",
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
obj.getAllUsers = (data) => {
    return new Promise((resolve, reject) => {
        let aggregateQuery = [];
        let query = { is_deleted: false, user_type: "1" };
        if (data.options && data.options.search) {
            let searchQuery = {
                $or: [
                    { fname: { $regex: data.options.search, $options: "i" } },
                    { lname: { $regex: data.options.search, $options: "i" } },
                    { email: { $regex: data.options.search, $options: "i" } },
                    { phone: { $regex: data.options.search, $options: "i" } },
                    { created_at: { $regex: data.options.search, $options: "i" } },
                ]
            };
            query = { $and: [query, searchQuery] };
        }
        aggregateQuery.push({ $match: query });
        if (data.options && data.options.sort) {
            let sortField = "$" + data.options.sort;
            aggregateQuery.push({
                $addFields: { sortField: { $toLower: sortField } }
            });
            let sortOrder = Number(data.options.order);
            aggregateQuery.push({ $sort: { sortField: sortOrder } });
        } else {
            aggregateQuery.push({ $sort: { created_at: -1 } });
        }
        if (data.options && data.options.offSet && data.options.limit) {
            let offSet = Number(data.options.offSet);
            let skip = (Number(offSet) - 1) * data.options.limit;
            aggregateQuery.push({ $skip: skip }, { $limit: data.options.limit });
        }

        User.aggregate(aggregateQuery).then(async result => {
            resolve(result);
        }).catch(err => {
            resolve({
                status: "Failure",
                code: 301
            });
        });

    })
}

// Method to check login details of admin
obj.addUserData = (data) => {
    return new Promise((resolve, reject) => {
        User.isEmailExist(data.email, function (exist) {
            if (exist) {
                resolve({
                    status: "Failure",
                    code: 304,
                    msg: "Email Exist"
                });
            }
            let new_user = new User(data);
            new_user.save(function (err, result) {
                if (err) {
                    resolve({
                        status: "Failure",
                        code: 301,
                        Error: "Error on Saving Data."
                    });
                } else {
                    resolve(result);
                }
            });
        });
    })
}

// Method to check login details of admin
obj.updateUserData = (data) => {
    return new Promise((resolve, reject) => {
        let updatedData = Object.assign({}, data);
        delete updatedData.id;
        User.findByIdAndUpdate(data.id, updatedData)
            .then(function (response) {
                resolve(200);
            })
            .catch(function (error) {
                reject(301);
            });
    })
}

// Method to check login details of admin
obj.getUserData = (data) => {
    return new Promise((resolve, reject) => {
        User.findById(data.ownerId, function (err, data) { 
            if (err){ 
                reject(err); 
            } 
            else{ 
                resolve(data)
            } 
        });
    })
}

// Method to check login details of admin
obj.deleteUserData = (data) => {
    return new Promise((resolve, reject) => {
        let deletedData = { is_deleted: 1 };
        User.update(
            { _id: { $in: data.records } },
            { $set: deletedData },
            { "multi": true }
        ).then(function (response) {
                resolve(200);
            })
            .catch(function (error) {
                reject(301);
            });
    })
}

// Method to check login details of admin
obj.changeActivationUserData = (data) => {
    return new Promise((resolve, reject) => {
        let updatedData = { is_blocked: data.is_blocked };
        User.findByIdAndUpdate(data.ownerId, updatedData)
            .then(function (response) {
                resolve(200);
            })
            .catch(function (error) {
                reject(301);
            });
    })
}

module.exports = obj;