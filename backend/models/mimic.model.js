var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var Schema = mongoose.Schema;

var MimicSchema = new Schema(
  {
    name: {
      type: String,
      default: null
    },
    mimic_type: {
      type: String,
      enum: ["0", "1"],
      default: "0"
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
    mimic_data: [],
    state: {
      type: String,
      default: null
    },
    is_deleted: {
      type: Boolean,
      default: false
    },
    is_blocked: {
      type: Number,
      enum: [0, 1],
      default: 0
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

MimicSchema.plugin(mongoosePaginate);
var mimics = mongoose.model("sites", MimicSchema);
module.exports = mimics;