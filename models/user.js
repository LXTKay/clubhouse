const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    hash: { type: String, required: true },
    memberstatus: { type: Boolean, required: true },
    isAdmin: { type: Boolean, required: true },
  })
;

module.exports = mongoose.model("User", UserSchema);