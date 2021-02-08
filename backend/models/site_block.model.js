var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var Schema = mongoose.Schema;

var SiteBlockSchema = new Schema(
  {
    site_id: { type: Schema.Types.ObjectId, ref: "sites" },
    pumpValue: {type: Number, default: 0},
    details: [],
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

SiteBlockSchema.plugin(mongoosePaginate);
var site_blocks = mongoose.model("site_blocks", SiteBlockSchema);
module.exports = site_blocks;