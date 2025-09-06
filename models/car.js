const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  image: String,
});

const Car = mongoose.model("Car", carSchema);
module.exports = Car;
