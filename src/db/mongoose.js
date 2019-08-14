const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', { 
    useCreateIndex: true,
    useNewUrlParser: true
});

const User = mongoose.model('User', { 
    name: String, 
    age: Number
});

const Task = mongoose.model('Task', {
    description: String,
    completed: Boolean
});

// example code

// const me = new User({
//     name: 'Alejandro',
//     age: 24
// });

// me.save().then(() => {
//     console.log('saved', me);
// }).catch((error) => {
//     console.log('not saved', error);
// })

// const task = new Task({
//     description: 'Feed the dog',
//     completed: false
// });

// task.save().then(() => {
//     console.log('saved', task);
// }).catch((error) => {
//     console.log('not saved', error);
// })