const request = require('supertest');

const app = require('../../src/app');
const User = require('../../src/models/user');

const users = require('../fixtures/users');
const { setupDatabase } = require('../fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
    const { email, password, name } = users[2];

    // assert successful signup
    const sendUser = { email, password, name };
    const response = await request(app)
        .post('/users')
        .send(sendUser)
        .expect(201);

    // assert user was added to the database
    const createdUser = await User.findById(response.body.user._id);
    expect(createdUser).not.toBeNull();

    // assert content of created user
    expect(response.body).toMatchObject({
        user: { email, name },
        token: createdUser.tokens[0].token
    });
    expect(createdUser.password).not.toBe(password);
});

test('Should login an existing user', async () => {
    const { _id, email, password } = users[0];

    // assert successful login
    const loginUser = { email, password };
    const response = await request(app)
        .post('/users/login')
        .send(loginUser)
        .expect(200);

    // assert auth tokens match
    const user = await User.findById(_id);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login non-existent user', async () => {
    const user = users[2];

    await request(app)
        .post('/users/login')
        .send(user)
        .expect(400);
});

test('Should get profile for user', async () => {
    const user = users[0];
    const token = user.tokens[0].token;

    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    const { _id, tokens } = users[0];
    const token = tokens[0].token;

    // assert successful delete
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200);

    // assert user was deleted from database
    const user = await User.findById(_id);
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should upload avatar image', async () => {
    const { _id, tokens } = users[0];
    const token = tokens[0].token;

    // assert successful upload
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    // assert avatar was added to user
    const user = await User.findById(_id);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update user information', async () => {
    const { _id, tokens } = users[0];
    const token = tokens[0].token;

    const newInfo = {
        name: 'Bruce Wanye',
        email: 'bat@man.com',
    };

    // assert successful update
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send(newInfo)
        .expect(200);

    // assert changes were made
    const user = await User.findById(_id);
    expect(user.name).toEqual(newInfo.name);
    expect(user.email).toEqual(newInfo.email);
});

test('Should not update invalid user information', async () => {
    const { tokens } = users[0];
    const token = tokens[0].token;

    const newInfo = {
        location: 'Gotham City'
    };

    // assert rejected update
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send(newInfo)
        .expect(400);
});