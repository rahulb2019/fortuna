var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var Schema = mongoose.Schema;

var SiteSummarySchema = new Schema(
  {
    site_id: { type: Schema.Types.ObjectId, ref: "sites" },
    date: Date,
    pumpData: [],
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

SiteSummarySchema.plugin(mongoosePaginate);
var site_summary = mongoose.model("site_summary", SiteSummarySchema);
module.exports = site_summary;