const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
    Todo.deleteMany({}).then(() => done())
})

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

                Todo.find().then((todos) => {
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e))
            })
    })
})