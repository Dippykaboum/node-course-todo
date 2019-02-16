const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
       return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB');
    const db = client.db('TodoApp');

    // db.collection('Todos').find({_id: new ObjectID('5c687bc4d2e2244b4c02932d')}).toArray().then((docs) => {
    //     console.log('Todos:');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch data', err);
    // });

    db.collection('Todos').find().count().then((count) => {
        console.log('Todos count: ', count);
    }, (err) => {
        console.log('Unable to fetch data', err);
    });

    //client.close();
})