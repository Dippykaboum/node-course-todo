const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
       return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Stuff to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Error while adding onject to database', err);
    //     }
    //     console.log(JSON.stringify(result.ops));
    // });

    db.collection('Users').insertOne({
       name: 'Francesco',
       age: 25,
       location: 'Berlin'
    }, (err, result) => {
        if (err) {
            return console.log('Error while adding onject to database', err);
        }
        console.log(JSON.stringify(result.ops));
    });

    client.close();
})