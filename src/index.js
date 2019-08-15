const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.post('/users', (req, res) => {
    res.send('testing...');
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});