var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var AdminSchema = new Schema(
  {
    // reseller_id: { type: Schema.Types.ObjectId, ref: "resellers" },
    // company_id: { type: Schema.Types.ObjectId, ref: "companies" },
    first_name: {
      type: String,
      default: null
    },
    last_name: {
      type: String,
      default: null
    },
    email: {
      type: String,
      lowercase: true,
      unique: [true, "This Email already exist!"],
      required: "email is required"
    },
    password: {
      type: String,
      required: "Password is required",
      select: false
    },
    phone: {
      type: String,
      default: null
    },
    access_type: {
      type: String,
      enum: ["read", "write"],
      default: "read"
    },
    image: { type: String, default: null },
    email_verification_token: {
      type: String
    },
    salt: {
      type: String
    },
    token: {
      type: String,
      default: null
    },
    forgot_password_token: {
      type: String
    },
    is_deleted: {
      type: Boolean,
      default: false
    },
    is_active: {
      type: Boolean,
      default: true
    },
    access_type: {
      type: String,
      enum: ["0", "1"],
      default: "0"
    },
    is_blocked: {
      type: String,
      enum: ["0", "1"],
      default: "0"
    },
    user_type:{
      type: String,
      enum: ["0", "1"],
      default: "1"
    },
    selectedSites: []
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// AdminSchema.pre("save", function(next) {
//   var user = this;
//   // generate a random salt for every user for security
//   user.salt = crypto.randomBytes(16).toString("hex");
//   user.email_verification_token = crypto.randomBytes(16).toString("hex");
//   user.password = crypto
//     .pbkdf2Sync(user.password, this.salt, 1000, 64, "sha512")
//     .toString("hex");
//   next();
// });

AdminSchema.methods.generateJwt = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email
    },
    secret.secret,
    { expiresIn: "12h" }
  );
};

AdminSchema.methods.verifyToken = function(token, cb) {
  jwt.verify(token, secret.secret, function(err, dcode) {
    if (err) {
      cb(false);
    } else {
      cb(dcode);
    }
  });
};

AdminSchema.statics.isEmailExist = function(email, callback) {
  var flag = false;
  admins.findOne({ email: email, is_deleted: false }, function(err, user) {
    if (err) {
      res.json({ status: 0, msg: "Something went wrong" });
    } else {
      if (user) {
        flag = true;
      } else {
        flag = false;
      }
    }
    callback(flag);
  });
};

AdminSchema.plugin(mongoosePaginate);
var admins = mongoose.model("admins", AdminSchema);
module.exports = admins;