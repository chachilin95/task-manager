const request = require('supertest');

const app = require('../../src/app');
const { setupDatabase } = require('../fixtures/db');

// models
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

// fixtures
const users = require('../fixtures/users');
const tasks = require('../fixtures/tasks');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    const { tokens } = users[0];
    const token = tokens[0].token;

    const { description } = tasks[0];
    const newTask = { description };

    // assert successful creation
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(newTask)
        .expect(201);

    // assert task was added to the database
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();

    // assert content of added task
    expect(task.completed).toEqual(false);
});