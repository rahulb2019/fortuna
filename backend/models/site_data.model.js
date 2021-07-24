var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var Schema = mongoose.Schema;

var SiteDataSchema = new Schema(
  {
    site_id: { type: Schema.Types.ObjectId, ref: "sites" },
    date: Date,
    pumpData: [],
    meterData: [],
    flowData: [],
    levelData: [],
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

SiteDataSchema.plugin(mongoosePaginate);
var site_data = mongoose.model("site_datas", SiteDataSchema);
module.exports = site_data;