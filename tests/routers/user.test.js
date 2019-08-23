const request = require('supertest');

const app = require('../../src/app');
const User = require('../../src/models/user');
const users = require('../fixtures/user');

beforeEach(async () => {
    await User.deleteMany(); // clear db
    await new User(users[0]).save(); // add test user
});

test('Should signup a new user', async () => {
    const user = users[1];

    await request(app)
        .post('/users')
        .send(user)
        .expect(201);
});

test('Should login an existing user', async () => {
    const user = users[0];

    await request(app)
        .post('/users/login')
        .send(user)
        .expect(200);
});

test('Should not login non-existent user', async () => {
    const user = users[1];

    await request(app)
        .post('/users/login')
        .send(user)
        .expect(400);
});