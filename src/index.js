require('./db/mongoose');
const express = require('express');

const UserRouter = require('./routers/user');
const TaskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// setup routers
app.use(UserRouter);
app.use(TaskRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});