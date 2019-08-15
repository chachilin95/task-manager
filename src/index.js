require('./db/mongoose');
const express = require('express');

// models
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/users', (_req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.get('/users/:id', (req, res) => {
    const id = req.params.id;

    User.findById(id).then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.get('/tasks', (_req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.get('/tasks/:id', (req, res) => {
    const id = req.params.id;

    Task.findById(id).then((task) => {
        if (!task) {
            return res.send(404).send();
        }
        res.send(task);
    }).catch((error) => {
        res.status(500).send(error);
    })
});

app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
        res.status(201).send(user);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);

    task.save().then(() => {
        res.status(201).send(task);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});