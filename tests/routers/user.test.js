const request = require('supertest');

const app = require('../../src/app');
const User = require('../../src/models/user');
const users = require('../fixtures/user');

beforeEach(async () => {
    await User.deleteMany(); // clear db
    await new User(users[0]).save(); // add test user
});

test('Should signup a new user', async () => {
    const { email, password, name } = users[1];
    
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
    const user = users[1];

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