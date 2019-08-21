const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');

const Task = require('./task');

const definition = {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
};

const options = {
    timestamps: true
};

const userSchema = new mongoose.Schema(definition, options);

// form relationship between User and Task IDs
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

// locate user to login
userSchema.statics.findByCredentials = async (email, password) => {
    
    // locate user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login.');
    }

    // compare password hashes
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login.');
    }

    return user;
};

// generate JWT for user
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'afigueroa1234');

    // add token to tokens db
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

// return public information
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    // remove private information
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

// hash password before submitting
userSchema.pre('save', async function (next) {
    const user = this;
    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// delete a user's tasks before deleting user
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User