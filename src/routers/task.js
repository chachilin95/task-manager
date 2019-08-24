const express = require('express');
const router = new express.Router();

const Task = require('../models/task');
const auth = require('../middleware/auth');

// get all tasks
router.get('/tasks', auth, async (req, res) => {

    // gather queries
    const match = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    // set options
    const options = {};
    if (req.query.limit) {
        options.limit = parseInt(req.query.limit);
    }
    if (req.query.skip) {
        options.skip = parseInt(req.query.skip);
    }
    if (req.query.sortBy) {
        const [field, order] = req.query.sortBy.split(':');
        options.sort = {};
        options.sort[field] = order === 'asc' ? 1 : -1;
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

// get task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
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
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// delete task by id
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const owner = req.user._id;

    try {
        const task = await Task.findOneAndDelete({ _id, owner });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

// update task by id
router.patch('/tasks/:id', auth, async (req, res) => {

    // determine if update is valid
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;