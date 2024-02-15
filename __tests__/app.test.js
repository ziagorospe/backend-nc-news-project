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
        test('should respond 200 and return all topics when called correctly', () => {
            const expected = { 
            topics:
                [
                    { slug: 'mitch', description: 'The man, the Mitch, the legend' },
                    { slug: 'cats', description: 'Not dogs' },
                    { slug: 'paper', description: 'what books are made of' }
                  ]
            }
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response)=>{
                const body = response.body
                expect(body).toEqual(expected);
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
                const body = response.body
                expect(body).toMatchObject(endPoints)
            })
        });
        test('should reject 404 with no body when an api that does not exist is called', () => {
            return request(app)
            .get('/api/forklift')
            .expect(404)
            .then((response)=>{
                const body = response.body
                expect(body).toEqual({});
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
                const body = response.body
                expect(body.article).toEqual(validArticle);
            })
        })
        test('should reject 400 when given and article ID that does not exist', () => {
            return request(app)
            .get('/api/articles/9999')
            .expect(400)
        });
    });      
});