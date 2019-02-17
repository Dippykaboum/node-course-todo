const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5c692d80752d0c2464046cdf';

if (!ObjectID.isValid(id)) {
    return console.log('ID not valid');
}

Todo.find({
    _id: id
}).then((todos) => console.log('Todos: ', todos));

var q = Todo.findOne({
    _id: id
});
q.then((todo) => console.log('Todo: ', todo));

Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('ID not found');
    }
    console.log(`Todo By ID: ${todo}`);
});