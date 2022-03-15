var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var Schema = mongoose.Schema;

var SiteControlSchema = new Schema(
  {
    site_id: { type: Schema.Types.ObjectId, ref: "sites" },
    control_blocks: []
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

SiteControlSchema.plugin(mongoosePaginate);
var site_controls = mongoose.model("site_controls", SiteControlSchema);
module.exports = site_controls;