const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
//constants
const PORT = 3000;

//connect to the database
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

const Car = require("./models/Car.js");

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

//get
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/cars", async (req, res) => {
  const allCars = await Car.find();
  res.render("cars/index.ejs", { cars: allCars });
});

app.get("/cars/new", (req, res) => {
  res.render("cars/new.ejs");
});

app.get("/cars/:carId", async (req, res) => {
  const foundCar = await Car.findById(req.params.carId);
  res.render("cars/show.ejs", { car: foundCar });
});

app.get("/cars/:carId/edit", async (req, res) => {
  const foundCar = await Car.findById(req.params.carId);
  res.render("cars/edit.ejs", {
    car: foundCar,
  });
});

//post
app.post("/cars", async (req, res) => {
  await Car.create(req.body);
  res.redirect("/cars"); // redirect to index cars
});

//put
app.put("/cars/:carId", async (req, res) => {
  // Update the car in the database
  await Car.findByIdAndUpdate(req.params.carId, req.body);
  // Redirect to the car's show page to see the updates
  res.redirect(`/cars/${req.params.carId}`);
});

//delete
app.delete("/cars/:carId", async (req, res) => {
  await Car.findByIdAndDelete(req.params.carId);
  res.redirect("/cars");
});

//port
app.listen(PORT, () => {
  console.log("Listening on port 3000");
});
