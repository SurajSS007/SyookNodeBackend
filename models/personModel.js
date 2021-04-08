const mongoose = require("mongoose"); //importing mongoose

//userSchema for user
var personSchema = new mongoose.Schema({
  name: String,
  time:  { type: Date },
  stream: [
    {
      name: { type: String },
      origin: { type: String },
      destination: { type: String },
      timestamp: { type: Date },
    },
  ],
});

module.exports = mongoose.model("Person", personSchema); //exporting schema
