const mongoose = require('mongoose');
require('../config/config');
mongoose.set('useCreateIndex', true);

const FoodSchema = mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String,
    calories: Number,
    proteins: Number,
    carbs: Number,
    fats: Number,
    addedBy: String,
    state: String
});

const Food = module.exports = mongoose.model('Food', FoodSchema);