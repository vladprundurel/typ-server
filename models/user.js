const mongoose = require('mongoose');
require('../config/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
mongoose.set('useCreateIndex', true);

const UserSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: 'First name can\'t be empty'
    },
    last_name: {
        type: String,
        required: 'Last name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength: [4, 'Password must be at least 4 characters long']
    },
    role: {
        type: String,
        // default: 'user'
    },
    saltSecret: String
});

//Custom validation for email
UserSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,13}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

//Generate saltSecret and encrypt password before saving
UserSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => { 
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

//Methods
UserSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


UserSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        "SECRET#123",
        {
            expiresIn: "50m"
        });
       // process.env.JWT_SECRET);
}

const User = module.exports = mongoose.model('User', UserSchema);