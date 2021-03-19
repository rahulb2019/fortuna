var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var Schema = mongoose.Schema;

var SiteScheduleSchema = new Schema(
  {
    site_id: { type: Schema.Types.ObjectId, ref: "sites" },
    pumpValue: {type: Number, default: 0},
    schedule_blocks: []
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

SiteScheduleSchema.plugin(mongoosePaginate);
var site_schedules = mongoose.model("site_schedules", SiteScheduleSchema);
module.exports = site_schedules;