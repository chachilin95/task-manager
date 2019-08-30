require('./db/mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');

const UserRouter = require('./routers/user');
const TaskRouter = require('./routers/task');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setup routers
app.use(UserRouter);
app.use(TaskRouter);

module.exports = app;