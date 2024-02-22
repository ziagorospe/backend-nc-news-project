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
                for(let i=0; i<body.topics;i++){
                    expect(Object.keys(body.topics[i]).sort()).toEqual(['slug','description'].sort());
                }
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
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response)=>{
                expect(Object.keys(response.body.article).sort()).toEqual(['author','article_id','title','topic','created_at','votes','article_img_url','body','comment_count'].sort());
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
                const body = response.body
                for(let i=0; i<body.articles;i++){
                expect(Object.keys(body.articles[i]).sort()).toEqual(['author','title','article_id','topic','created_at','votes', 'article_img_url', 'comment_count'].sort());
                }
                expect(body.articles).toBeSortedBy('created_at', {descending: true});
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
                const body = response.body
                expect(Array.isArray(body.articleComments)).toBe(true);
                for(let i=0; i<body.articleComments;i++){
                    expect(Object.keys(body.articleComments[i]).sort()).toEqual(['comment_id','body','article_id','author','created_at','votes'].sort());
                } 
                expect(body.articleComments).toBeSortedBy('created_at', {descending: true});
            })
        });
        test('should reject 400 when given an invalid article ID', () => {
            return request(app)
            .get('/api/articles/forklift/comments')
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe('bad request');
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
                for(let i=0; i<body.articleComment;i++){
                    expect(Object.keys(body.articleComment[i]).sort()).toEqual(['comment_id','body','article_id','author','created_at','votes'].sort());
                }  
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
                for(let i=0; i<body.users.length;i++){
                    expect(Object.keys(body.users[i]).sort()).toEqual(['username','name','avatar_url'].sort());
                }
            })
        });
    });
    describe('GET /api/articles?topic=:topic', () => {
        test('should respond 200 with an array of article objects filtered by topic, sorted by date descending', () => {
            return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then((response)=>{
                const body = response.body
                for(let i=0; i<body.articles;i++){
                expect(Object.keys(body.articles[i]).sort()).toEqual(['author','title','article_id','topic','created_at','votes', 'article_img_url', 'comment_count'].sort());
                expect(body.articles[i].topic).toBe('mitch');
                }
                expect(body.articles).toBeSortedBy('created_at', {descending: true});
            })
        });
        test('should reject 400 if given and invalid topic query', () => {
            return request(app)
            .get("/api/articles?topic=87")
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe('topic not found');
            })
        });
        test('should reject 404 if given a valid topic query that does not exist', () => {
            return request(app)
            .get("/api/articles?topic=brian")
            .expect(404)
            .then((response)=>{
                expect(response.body.msg).toBe('topic not found');
            })
        });
        test('should respond 200 with empty array if given a valid topic that doesnt have any related articles', () => {
            return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then((response)=>{
                expect(response.body.articles).toEqual([]);
            })
        });
    });
    describe('GET /api/articles?sort=:sort&order=:order', () => {
        test('should respond 200 with article objects sorted by created_at(default), ordered ascending when queried', () => {
            return request(app)
            .get("/api/articles?order=ASC")
            .expect(200)
            .then((response)=>{
                const body = response.body
                for(let i=0; i<body.articles;i++){
                expect(Object.keys(body.articles[i]).sort()).toEqual(['author','title','article_id','topic','created_at','votes', 'article_img_url', 'comment_count'].sort());
                }
                expect(body.articles).toBeSortedBy('created_at', {ascending: true});
            })
        });
        test('should respond 200 with article objects sorted by author, ordered descending(default) when queried', () => {
            return request(app)
            .get("/api/articles?sort=author")
            .expect(200)
            .then((response)=>{
                const body = response.body
                for(let i=0; i<body.articles;i++){
                expect(Object.keys(body.articles[i]).sort()).toEqual(['author','title','article_id','topic','created_at','votes', 'article_img_url', 'comment_count'].sort());
                }
                expect(body.articles).toBeSortedBy('author', {descending: true});
            })
        });
        test('should respond 200 with article objects sorted by comment_count, ordered ascending when queried', () => {
            return request(app)
            .get("/api/articles?order=ASC&sort=comment_count")
            .expect(200)
            .then((response)=>{
                const body = response.body
                for(let i=0; i<body.articles;i++){
                expect(Object.keys(body.articles[i]).sort()).toEqual(['author','title','article_id','topic','created_at','votes', 'article_img_url', 'comment_count'].sort());
                }
                expect(body.articles).toBeSortedBy('comment_count', {ascending: true});
            })
        });
        test('should respond 200 with article objects sorted by title, ordered ascending when queried regardless of case', () => {
            return request(app)
            .get("/api/articles?order=AsC&sort=Title")
            .expect(200)
            .then((response)=>{
                const body = response.body
                for(let i=0; i<body.articles;i++){
                expect(Object.keys(body.articles[i]).sort()).toEqual(['author','title','article_id','topic','created_at','votes', 'article_img_url', 'comment_count'].sort());
                }
                expect(body.articles).toBeSortedBy('title', {ascending: true});
            })
        });
        test('should respond 200 with article objects sorted by title, ordered ascending, filtered by topic when queried', () => {
            return request(app)
            .get("/api/articles?order=ASC&sort=title&topic=mitch")
            .expect(200)
            .then((response)=>{
                const body = response.body
                for(let i=0; i<body.articles;i++){
                    expect(Object.keys(body.articles[i]).sort()).toEqual(['author','title','article_id','topic','created_at','votes', 'article_img_url', 'comment_count'].sort());
                    expect(body.articles[i].topic).toBe('mitch');
                    }
                expect(body.articles).toBeSortedBy('title', {ascending: true});
            })
        });
        test('should reject 400 invalid order queries', () => {
            return request(app)
            .get("/api/articles?order=57")
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe('bad request, invalid order');
            })
        });
        test('should reject 400 invalid sort queries', () => {
            return request(app)
            .get("/api/articles?sort=brian")
            .expect(400)
            .then((response)=>{
                expect(response.body.msg).toBe('bad request, invalid sort');
            })
        });
    });    
});