const mongoose = require('mongoose');
require('../config/config');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const CheckInSchema = mongoose.Schema({
    userId: String,
    date: Date,
    weight: Number,
    neck: Number,
    waist: Number,
    hips: Number,
}, {strict: false});

const CheckIn = module.exports = mongoose.model('CheckIn', CheckInSchema);