const db = require(`${__dirname}/../db/connection.js`);
const request = require("supertest");
const app = require(`${__dirname}/../db/app.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const endPoints = require(`${__dirname}/../endpoints.json`)

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('NC NEWS', () => {
    describe('GET /api/topics', () => {
        test('should respond 200 when called correctly', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
        });
        test('should respond 200 and return an array of topci objects', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response)=>{
                const body = response.body
                expect(Array.isArray(body.topics)).toBe(true);
                expect(Object.keys(body.topics[0]).sort()).toEqual(['slug','description'].sort());
            })
        });
    }); 
    describe('GET /api', () => {
        test('should respond 200 when called correctly', () => {
            return request(app)
            .get('/api')
            .expect(200)
        });
        test('should respond 200 and return all endpoint info when called correctly', () => {
            const expected = endPoints;
            return request(app)
            .get('/api')
            .expect(200)
            .then((response)=>{
                expect(response.body).toMatchObject(expected)
            })
        });
        test('should reject 404 with no body when an api that does not exist is called', () => {
            return request(app)
            .get('/api/forklift')
            .expect(404)
            .then((response)=>{
                expect(response.body).toEqual({});
            })
        });
    });
    describe('GET /api/articles/:article_id', () => {
        test('should respond 200 when called correctly', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
        });
        test('should respond 200 and return article with specific ID when called', () => {
            const validArticle = {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              };
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response)=>{
                expect(response.body.article).toEqual(validArticle);
            })
        })
        test('should reject 400 when given an invalid article ID', () => {
            return request(app)
            .get('/api/articles/forklift')
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe('bad request');
            })
        });
        test('should reject 404 when given and article ID that does not exist', () => {
            return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe('article not found');
            })
        });        
    });
    describe('GET /api/articles', () => {
        test('should respond 200 when called correctly', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
        });
        test('should respond 200 with all articles with correct properties, sorted by date descending', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response)=>{
                expect(Object.keys(response.body.articles[0]).sort()).toEqual(['author','title','article_id','topic','created_at','votes', 'article_img_url', 'comment_count'].sort());
                expect(response.body.articles).toBeSortedBy('created_at', {descending: true});
            })
        });
    });
    describe('GET /api/articles/:article_id/comments', () => {
        test('should respond 200 when called correctly', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
        });
        test('should respond 200 with an object with key of articleComments and a value of an array of comment objects, ordered by created_at descending', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response)=>{
                expect(Array.isArray(response.body.articleComments)).toBe(true);
                expect(Object.keys(response.body.articleComments[0]).sort()).toEqual(['comment_id','body','article_id','author','created_at','votes'].sort());
                expect(response.body.articleComments).toBeSortedBy('created_at', {descending: true});
            })
        });
        test('should reject 400 when given an invalid article ID', () => {
            return request(app)
            .get('/api/articles/forklift/comments')
            .expect(400)
            .then((response)=>{
                expect(response.body.code).toBe('22P02');
            })
        });
        test('should reject 404 when given an article ID that does not exist', () => {
            return request(app)
            .get('/api/articles/9999/comments')
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe('article not found');
            })
        });
        test('should respond 200 with msg "no comments found" if article ID exists and no comments found', () => {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then((response)=>{
                expect(response.body.msg).toBe('no comments found :(');
            })
        });
    });  
    describe('POST api/articles/:article_id/comments', () => {
        test('should respond 201 with posted comment when called with valid ID and body', () => {
            const commentObj = {
                username: 'zmoney',
                body: 'mic check, 1-2, 1-2'
            }
            return request(app)
            .post('/api/articles/2/comments')
            .send(commentObj)
            .expect(201)
            .then((response)=>{
                const body = response.body
                expect(Array.isArray(body.articleComment)).toBe(true);
                expect(Object.keys(body.articleComment[0]).sort()).toEqual(['comment_id','body','article_id','author','created_at','votes'].sort());
            })
        });
        test('should reject 400 when not given a request body', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe('bad request');
            })
        });
        test('should reject 400 when given an invalid article ID', () => {
            const commentObj = {
                username: 'zmoney',
                body: 'mic check, 1-2, 1-2'
            }
            return request(app)
            .post('/api/articles/forklift/comments')
            .send(commentObj)
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe('bad request');
            })
        });
        test('should reject 404 when given an article ID that does not exist', () => {
            const commentObj = {
                username: 'zmoney',
                body: 'mic check, 1-2, 1-2'
            }
            return request(app)
            .post('/api/articles/9999/comments')
            .send(commentObj)
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe('not found');
            })
        });
        test('should reject 404 when given user that does not exist', () => {
            const commentObj = {
                username: 'shark',
                body: 34
            }
            return request(app)
            .post('/api/articles/2/comments')
            .send(commentObj)
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe('not found');
            })
        });
    });
    describe('PATCH /api/articles/:article_id', () => {
        test('should respond 200 with the updated article object and the correctly updated number of votes', () => {
            const voteObj = { inc_votes: 5 }
            return request(app)
            .patch('/api/articles/2')
            .send(voteObj)
            .then(()=>{
                return request(app)
                .patch('/api/articles/2')
                .send(voteObj)
                .expect(200)  
            }).then((response)=>{
                const body = response.body;
                expect(Array.isArray(body.article)).toBe(false);
                expect(Object.keys(body.article).sort()).toEqual(['title','topic','author','votes'].sort());
                expect(body.article.votes).toBe(10);
                return request(app)
                .patch('/api/articles/2')
                .send({inc_votes: -20})
                .expect(200)  
            }).then((response)=>{
                expect(response.body.article.votes).toBe(-10);
            })
        });
        test('should reject 400 invalid vote values', () => {
            const voteObj = { inc_votes: 'hound' }
            return request(app)
            .patch('/api/articles/2')
            .send(voteObj)
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe('bad request');
            })
        });
        test('should reject 400 invalid article IDs', () => {
            const voteObj = { inc_votes: 10 }
            return request(app)
            .patch('/api/articles/forklift')
            .send(voteObj)
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe('bad request');
            })
        });
        test('should reject 404 valid article IDs that do not exist', () => {
            const voteObj = { inc_votes: 10 }
            return request(app)
            .patch('/api/articles/9999')
            .send(voteObj)
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe('article not found');
            })
        });
    });
    describe('DELETE /api/comments/:comment_id', () => {
        test('should respond 204 with no content after deletion', () => {
            return request(app)
            .delete('/api/comments/3')
            .expect(204)
        });
        test('should respond 204 and comment should no longer exist in the database', () => {
            return request(app)
            .delete('/api/comments/3')
            .expect(204)
            .then((response)=>{
                expect(response.body).toEqual({});
                return request(app)
                .get('/api/comments/3')
                .expect(404)
            })
            .then((response)=>{
                expect(response.body.msg).toBe('comment not found');
            }) 
        });
        test('should reject 400 invalid article ID ', () => {
            return request(app)
            .delete('/api/comments/forklift')
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe('bad request');
            })
        });
        test('should reject 404 valid comment ID that does not exist', () => {
            return request(app)
            .delete('/api/comments/9999')
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe('comment not found');
            })
        });
    });
    describe('GET /api/users', () => {
        test('should respond 200 when called correctly', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
        });
        test('should respond 200 with a list of users object', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then((response)=>{
                const body = response.body
                expect(Array.isArray(body.users)).toBe(true);
                expect(Object.keys(body.users[0]).sort()).toEqual(['username','name','avatar_url'].sort());
            })
        });
    });    
});