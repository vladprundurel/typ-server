const mongoose = require('mongoose');
require('../config/config');
mongoose.set('useCreateIndex', true);

const PersonalDetailsSchema = mongoose.Schema({
    // user: {
    //     type: String
    // },
    user: String,
    goal: String,
    age: Number,
    gender: String,
    height: Number,
    current_weight: Number,
    desired_weight: Number,
    activity_level: Number
});

const PersonalDetails = module.exports = mongoose.model('PersonalDetails', PersonalDetailsSchema);