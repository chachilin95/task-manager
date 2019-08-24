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

    // assert creation
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

test('Should not create task with invalid fields', async () => {
    const { tokens } = users[0];
    const token = tokens[0].token;

    const newTask = {
        description: 1234,
        completed: 1234
    };

    // assert rejected creation
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(newTask)
        .expect(400);
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

    // assert retrieval
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200);

    // assert number of tasks returned
    expect(response.body.length).toEqual(numTasksExpected);
});

test('Should get user task by id', async () => {
    const { tokens } = users[0];
    const { _id } = tasks[0];
    const token = tokens[0].token;

    // assert retrieval
    await request(app)
        .get(`/tasks/${_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200);
});

test('Should get only completed tasks', async () => {
    const { _id, tokens } = users[0];
    const token = tokens[0].token;

    // get number of tasks the user owns
    let numTasksExpected = 0;
    tasks.forEach((task) => {
        if (task.owner === _id && task.completed) {
            numTasksExpected++;
        }
    });

    // assert retrieval
    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200);

    // assert number of tasks returned
    expect(response.body.length).toEqual(numTasksExpected);
});

test('Should get only uncompleted tasks', async () => {
    const { _id, tokens } = users[0];
    const token = tokens[0].token;

    // get number of tasks the user owns
    let numTasksExpected = 0;
    tasks.forEach((task) => {
        if (task.owner === _id && !task.completed) {
            numTasksExpected++;
        }
    });

    // assert retrieval
    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200);

    // assert number of tasks returned
    expect(response.body.length).toEqual(numTasksExpected);
});

test('Should not get unowned task', async () => {
    const { tokens } = users[0];
    const { _id } = tasks[1];
    const token = tokens[0].token;

    // assert rejected retrieval
    await request(app)
        .get(`/tasks/${_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(404);
});

test('Should not get task by id if unauthenticated', async () => {
    const { _id } = tasks[0];

    // assert rejected retrieval
    await request(app)
        .get(`/tasks/${_id}`)
        .send()
        .expect(401);
});

test('Should delete user task', async () => {
    const { tokens } = users[0];
    const { _id } = tasks[0];
    const token = tokens[0].token;

    // assert deletion
    await request(app)
        .delete(`/tasks/${_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200);

    // assert task was deleted
    const task = await Task.findById(_id);
    expect(task).toBeNull();
});

test('Should not delete task if not logged in', async () => {
    const { _id } = tasks[0];

    // assert rejected deletion
    await request(app)
        .delete(`/tasks/${_id}`)
        .send()
        .expect(401);
});

test('Should not delete unowned task', async () => {
    const { tokens } = users[0];
    const { _id } = tasks[1];
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

test('Should update user task with new data', async () => {
    const { tokens } = users[0];
    const { _id } = tasks[0];
    const token = tokens[0].token;

    const updates = {
        description: 'updated text',
        completed: false
    };

    // assert update
    await request(app)
        .patch(`/tasks/${_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates)
        .expect(200);

    // assert updates were saved
    const task = await Task.findById(_id);
    expect(task.description).toEqual(updates.description);
    expect(task.completed).toEqual(updates.completed);
});

test('Should not update unowned task', async () => {
    const { tokens } = users[0];
    const { _id } = tasks[1];
    const token = tokens[0].token;

    const updates = {
        description: 'updated text',
        completed: false
    };

    // assert update
    await request(app)
        .patch(`/tasks/${_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates)
        .expect(404);
});

test('Should not update user task with invalid data', async () => {
    const { tokens } = users[0];
    const { _id } = tasks[0];
    const token = tokens[0].token;

    const updates = {
        description: 1234,
        completed: 1234
    };

    // assert update
    await request(app)
        .patch(`/tasks/${_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates)
        .expect(400);
});