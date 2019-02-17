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
    text: 'second test todo',
    completed: true,
    completedAt: 333
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

describe('DELETE /todo/:id', () => {
    it('should delete specified todo', (done) => {
        var hexid = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexid}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexid)
            })
            .end((e, res) => {
                if (e) {
                    return done(e)
                }
                Todo.findById(hexid).then((todo) => {
                    expect(todo).toBeFalsy();
                    done()
                }).catch((e) => done(e))
            });
    });

    it('should return 404 if id is not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 if id is invalid', (done) => {
        request(app)
            .delete('/todos/123456')
            .expect(404)
            .end(done)
    });
});

describe('PATCH /todos/:id', () => {
    it('should update and complete the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var data = {
            text: 'The changed text',
            completed: true
        };

        request(app)
            .patch(`/todos/${id}`)
            .send(data)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(data.text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe("number");
            })
            .end(done);
    });

    it('should decomplete a todo', (done) => {
        var id = todos[1]._id.toHexString();
        var data = {
            text: 'The updated text',
            completed: false
        };

        request(app)
            .patch(`/todos/${id}`)
            .send(data)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(data.text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done)
    });
});