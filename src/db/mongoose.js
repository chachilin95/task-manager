const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION, { 
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
});