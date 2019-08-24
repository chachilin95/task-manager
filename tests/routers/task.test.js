const request = require('supertest');

const app = require('../../src/app');
const { setupDatabase } = require('../fixtures/db');

// models
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

test('Should get tasks for user', async () => {
    const { _id, tokens } = users[0];
    const token = tokens[0].token;

    // get number of tasks the user owns
    let numTasksExpected = 0;
    tasks.forEach((task) => {
        if (task.owner === _id) {
            numTasksExpected++;
        }
    });

    // assert successful retrieval
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200);

    // assert number of tasks returned
    expect(response.body.length).toEqual(numTasksExpected);
});

test('Should not delete unowned task', async () => {
    const { tokens } = users[0];
    const { _id } = tasks[1]; // users[1] owns tasks[1]
    const token = tokens[0].token;

    // assert rejected deletion
    await request(app)
        .delete(`/tasks/${_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(404);

    // assert task was not deleted
    const task = await Task.findById(_id);
    expect(task).not.toBeNull();
});