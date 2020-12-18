var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var Schema = mongoose.Schema;

var SiteImageCategorySchema = new Schema(
  {
    name: {
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

SiteImageSchema.plugin(mongoosePaginate);
var site_image_categories = mongoose.model("site_image_categories", SiteImageCategorySchema);
module.exports = site_image_categories;