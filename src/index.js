require('./db/mongoose');
const express = require('express');

// models
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// get all users
app.get('/users', async (_req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// get user by id
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// create new user
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);

        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// delete user by id
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// update user by id
app.patch('/users/:id', async (req, res) => {

    // determine if update is valid
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates.' });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// get all tasks
app.get('/tasks', async (_req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

// get task by id
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.send(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

// create new task
app.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);

        await task.save();
        res.send(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// delete task by id
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

// update task by id
app.patch('/tasks/:id', async (req, res) => {

    // determine if update is valid
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});