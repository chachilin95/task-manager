const express = require('express');
const router = new express.Router();
const multer = require('multer');

const User = require('../models/user');
const auth = require('../middleware/auth');

// get logged in user's information
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// get user by id
router.get('/users/:id', async (req, res) => {
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

// signup new user
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// login user
router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

// logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

// logout all user sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

// upload new avatar
const upload = multer({
    dest: 'images/avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        const imgRegEx = /\.(jpg|jpeg|png)$/;
        if (!file.originalname.match(imgRegEx)) {
            return cb(new Error('File must be an image'));
        }

        cb(undefined, true);
    }
});
router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send();
});

// delete logged in user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// update logged in user
router.patch('/users/me', auth, async (req, res) => {

    // determine if update is valid
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates.' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;