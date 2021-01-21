const mongoose = require('mongoose');
require('../config/config');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const MealSchema = mongoose.Schema({
    "mealByUser": {
        "date": Date,
        "nutritionFacts": {
            totalCalories: Number,
            totalProteins: Number,
            totalFats: Number
        }
    }
}, {strict: false});

const Meal = module.exports = mongoose.model('Meal', MealSchema);