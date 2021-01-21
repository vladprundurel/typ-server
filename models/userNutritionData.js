const mongoose = require('mongoose');
require('../config/config');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const UserNutritionDataSchema = mongoose.Schema({}, {strict: false});

const UserNutritionData = module.exports = mongoose.model('User_Nutrition_Data', UserNutritionDataSchema);