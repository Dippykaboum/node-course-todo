const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
       return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB');
    const db = client.db('TodoApp');

    db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
        console.log(result);
    })

    //client.close();
})