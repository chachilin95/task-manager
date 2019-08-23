const mongoose = require('mongoose');

const users = require('./users');

const objectIDs = new Array(3).fill(new mongoose.Types.ObjectId());

const tasks = [{
    _id: objectIDs[0],
    description: 'Make a deal',
    completed: true,
    owner: users[0]._id
}, {
    _id: objectIDs[1],
    description: 'Win the war',
    completed: false,
    owner: users[1]._id
}, {
    _id: objectIDs[2],
    description: 'Be cool',
    completed: true,
    owner: users[2]._id
}]

module.exports = tasks;