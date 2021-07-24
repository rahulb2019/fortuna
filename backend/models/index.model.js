const User = require("./user.model");
const Admin = require("./admin.model");
const Mimic = require("./mimic.model");
const SIC = require("./site_image_category.model");
const SI = require("./site_image.model");
const SB = require("./site_block.model");
const SS = require("./site_schedule.model");
const SD = require("./site_data.model");
const SSM = require("./site_summary.model");
module.exports = {
    User: User,
    Admin: Admin,
    Mimic: Mimic,
    SIC: SIC,
    SI: SI,
    SB: SB,
    SS: SS,
    SD: SD,
    SSM: SSM
}