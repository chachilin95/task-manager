// CRUD = Create Read Update Delete

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('mongodb connection error: ', error)
    }

    const db = client.db(databaseName);

    db.collection('users').insertOne({
        name: 'Alejandro',
        age: 24
    }, (error, result) => {
        if (error) {
            return console.log('Failed to insert item');
        }

        result.ops.forEach((op) => console.log(op));
    });

    db.collection('tasks').insertMany([
        {
            description: 'get the mail',
            completed: false
        }, {
            description: 'earn a million dollars',
            completed: false
        }, {
            description: 'be happy',
            completed: true
        }
    ], (error, result) => {
        if (error) {
            return console.log(error)
        }

        console.log(result.ops);
    });
});