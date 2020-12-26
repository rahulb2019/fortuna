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
    lattitude: {
      type: String,
      default: null
    },
    longitude: {
      type: String,
      default: null
    },
    no_of_pumps: {
      type: Number,
      default: null
    },
    mimic_data: [],
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