var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var Schema = mongoose.Schema;

var SiteImageSchema = new Schema(
  {
    site_image_category_id: { type: Schema.Types.ObjectId, ref: "site_image_categories" },
    name: {
      type: String,
      default: null
    },
    state: {
      type: Number,
      enum: [0, 1],
      default: 0
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

SiteImageSchema.plugin(mongoosePaginate);
var site_images = mongoose.model("site_images", SiteImageSchema);
module.exports = site_images;