const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dateFormat = require("date-format");

const MessageSchema = new Schema({
  content: { type: String, required: true },
  title: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  author: { type: String, required: true },
});

MessageSchema.virtual("datestring").get(function () {
  return dateFormat.asString("yyyy-mm-dd hh:MM:ss",this.timestamp);
});

module.exports = mongoose.model("Message", MessageSchema)