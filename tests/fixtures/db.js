const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const users = require('./users');
const tasks = require('./tasks');

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    
    await new User(users[0]).save();
    await new User(users[1]).save();

    await new Task(tasks[0]).save();
    await new Task(tasks[1]).save();
};

module.exports = {
    setupDatabase
};