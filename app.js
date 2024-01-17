const express = require("express");
const logger = require("morgan");

const app = express();
const mongoose = require("mongoose");
// Recipe model
const Recipe = require("./models/Recipe.model");

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());

// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

mongoose
  .connect(MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

// ROUTES
//  GET  / route - This is just an example route
app.get("/", (req, res) => {
  res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});

//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post("/recipes", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).send("Error creating the recipe: " + error.message);
  }
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).send("Error retrieving the recipes: " + error.message);
  }
});
//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get("/recipes/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving the recipe: " + error.message });
  }
});
//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put("/recipes/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, {
      new: true,
    });
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating the recipe: " + error.message });
  }
});
//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete("/recipes/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting the recipe: " + error.message });
  }
});
// Start the server
app.listen(5006, () => console.log("My first app listening on port 5005!"));

//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
