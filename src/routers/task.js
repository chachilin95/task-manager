const express = require('express');
const router = new express.Router();

const Task = require('../models/task');
const auth = require('../middleware/auth');

// get all tasks
router.get('/tasks', async (_req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

// get task by id
router.get('/tasks/:id', async (req, res) => {
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
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    
    try {
        await task.save();
        res.send(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// delete task by id
router.delete('/tasks/:id', async (req, res) => {
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
router.patch('/tasks/:id', async (req, res) => {

    // determine if update is valid
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const task = await Task.findById(req.params.id);

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;