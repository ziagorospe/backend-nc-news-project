const db = require(`${__dirname}/../db/connection.js`);
const request = require("supertest");
const app = require(`${__dirname}/../db/app.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);

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
        test('should reject 404 with no body when an api that does not exist is called', () => {
            return request(app)
            .get('/api/forklift')
            .expect(404)
            .then((response)=>{
                expect(response.body).toEqual({});
            })
        });
        test('should reject 400 invalid queries', () => {
            return request(app)
            .get('/api/topics?comfort=yes')
            .expect(400)
            .then((response)=>{
                expect(response.error.text).toEqual('bad request');
            })
        });
    });    
});