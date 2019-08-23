const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const users = require('./users');
const tasks = require('./tasks');

const testUser = users[0];

const setupDatabase = async () => {
    await User.deleteMany();
    await new User(testUser).save();

    // await Task.deleteMany();
    // await new Task(tasks[0]).save();
    // await new Task(tasks[1]).save();
};

module.exports = {
    testUser,
    setupDatabase
};