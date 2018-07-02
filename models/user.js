const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    } else {
        if (email.length < 5 || email.length > 30) {
            return false;
        }
        return true;
    }
}

// Validate Function to check if valid e-mail format
let validEmailChecker = (email) => {
    // Check if e-mail exists
    if (!email) {
        return false; // Return error
    } else {
        // Regular expression to test for a valid e-mail
        const regExp = 
        new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email); // Return regular expression test results (true or false)
    }
};

const emailValidators = [
    {
        validator: emailLengthChecker, message: 'E-mail must be at least 5 and less than 31 characters'
    },
    {
        validator: validEmailChecker,
        nessage: 'Must be a valid E-mail'
    }
];

let usernameLengthChecker = (username) => {
    if (!username) {
        return false;
    } else {
        if (username.length < 3 || username.length > 14) {
            return false;
        }
        return true;
    }
};

let validUsername = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

const usernameValidators = [{
        validator: usernameLengthChecker,
        message: "Username must be greater than 2 and less than 15 characters"
    },
    {
        validator: validUsername,
        message: "Username must be valid"
    }
];

let passwordLengthChecker = (password) => {
    if (!password) {
        return false;
    } else {
        if (password.length < 4 || password.length > 35) {
            return false;
        }
        return true;
    }
};

//feel free to add validators for extra secure passwords as you please for production environments

const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: "Password must be between 4 and 35 characters"
    }
];

const userSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: {type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: {type: String, required: true, validate: passwordValidators }
});



userSchema.pre('save', function(next) { 
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    })
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);