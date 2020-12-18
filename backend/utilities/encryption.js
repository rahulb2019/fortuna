const bcrypt = require('bcryptjs'),
      jwt = require('jsonwebtoken');

var obj = {}


// Method to hash the passsword during registration (encryption)
obj.hashPassword = async (password) => {
    salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password , salt);
    return password;
}


// Method to unhash the password during login (decryption)
obj.decryptPassword = async (password, hashedPassword) => {
    const value =  await bcrypt.compare(password, hashedPassword);
    return value;
}


// Method to create json web token
obj.generateJWT = async (id, first_name, last_name, email, phone) => {
    return jwt.sign({id : id, first_name : first_name, last_name : last_name, email : email, phone : phone }, 'secretkey');
}


module.exports = obj;