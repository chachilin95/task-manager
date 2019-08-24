const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userIDs = new Array(3).fill().map(() => new mongoose.Types.ObjectId());

const users = [{
    _id: userIDs[0],
    name: 'Django',
    email: 'django@example.com',
    password: 'django1234',
    tokens: [{
        token: jwt.sign({ _id: userIDs[0] }, process.env.API_SALT)
    }]
}, {
    _id: userIDs[1],
    name: 'Aldo Raine',
    email: 'aldoraine@example.com',
    password: 'aldoraine1234',
    tokens: [{
        token: jwt.sign({ _id: userIDs[1] }, process.env.API_SALT)
    }]
}, {
    _id: userIDs[2],
    name: 'Marsellus Wallace',
    email: 'marselluswallace@example.com',
    password: 'marselluswallace1234',
    tokens: [{
        token: jwt.sign({ _id: userIDs[2] }, process.env.API_SALT)
    }]
}];

module.exports = users;