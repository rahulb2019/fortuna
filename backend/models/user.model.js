var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var UserSchema = new Schema(
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
      enum: ["0", "1"],
      default: "0"
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
   address: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    zipcode: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: null
    },
    is_deleted: {
      type: Boolean,
      default: false
    },
    is_blocked: {
      type: String,
      enum: ["0", "1"],
      default: "0"
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

UserSchema.pre("save", function(next) {
  var user = this;
  // generate a random salt for every user for security
  user.salt = crypto.randomBytes(16).toString("hex");
  user.email_verification_token = crypto.randomBytes(16).toString("hex");
  user.password = crypto
    .pbkdf2Sync(user.password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  next();
});

UserSchema.methods.generateJwt = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email
    },
    secret.secret,
    { expiresIn: "12h" }
  );
};

UserSchema.methods.verifyToken = function(token, cb) {
  jwt.verify(token, secret.secret, function(err, dcode) {
    if (err) {
      cb(false);
    } else {
      //console.log("dcode", dcode);
      cb(dcode);
    }
  });
};

UserSchema.statics.isEmailExist = function(email, callback) {
  var flag = false;
  users.findOne({ email: email, is_deleted: false }, function(err, user) {
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

UserSchema.plugin(mongoosePaginate);
var users = mongoose.model("users", UserSchema);
module.exports = users;