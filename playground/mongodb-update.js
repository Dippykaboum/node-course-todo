const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
       return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB');
    const db = client.db('TodoApp');

    db.collection('Users').findOneAndUpdate({_id: new ObjectID('5c688132d2e2244b4c029500')},
    {$set: {name: 'Johanna'}, $inc: {age: 1}}, 
    {returnOriginal: false})
    .then((result) => console.log(result));

    //client.close();
})