const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo'
}];

beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        Todo.insertMany(todos)
    }).then(() => done())
});

describe('POST / todos', () => {
    it('should post a new note to the database', (done) => {
        var text = 'some test text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e))
            })
    })

    it('should not create todo with invalid input', (done) => {
        request(app)
            .post('/todos')
            .send({text: '  '})
            .expect(400)
            .end((e, res) => {
                if (e) {
                    return done(e)
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e))
            })
    })
})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    });
});

describe('Get /todos/:id', () => {
    it('should get the specified todo', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 if id is invalid', (done) => {
        request(app)
            .get('/todos/123456')
            .expect(404)
            .end(done)
    });
});