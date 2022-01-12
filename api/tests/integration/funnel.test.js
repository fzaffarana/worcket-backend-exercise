const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const app = require('../../../app');

describe('Funnel Routing - Integration Test', async () => {
  describe('GET /funnel/usersbystep', () => {
    it('the api should response with an error because empty body', async () => {
      await request(app)
        .get('/funnel/usersbystep')
        .send([])
        .expect(httpStatus.NOT_FOUND)
        .then(({ text }) => {
          expect(text).to.equal('Some step id is wrong');
        });
    });

    it('the api should response with an error because wrong body', async () => {
      await request(app)
        .get('/funnel/usersbystep')
        .send([1, 2, 3, 4, 5, 6])
        .send([])
        .expect(httpStatus.NOT_FOUND)
        .then(({ text }) => {
          expect(text).to.equal('Some step id is wrong');
        });
    });

    it('the api should response successfully when client ask for specific step ids', async () => {
      const { specificIds } = require('./funnel-expected-responses');
      await request(app)
        .get('/funnel/usersbystep')
        .send([2, 3])
        .expect(httpStatus.OK)
        .then(({ body }) => {
          expect(body).to.deep.equal(specificIds);
        });
    });

    it('the api should response successfully when client ask for all step ids', async () => {
      const { allIds } = require('./funnel-expected-responses');
      await request(app)
        .get('/funnel/usersbystep')
        .send([1, 2, 3])
        .expect(httpStatus.OK)
        .then(({ body }) => {
          expect(body).to.deep.equal(allIds);
        });
    });

    it('the api should response successfully when client ask for all step ids (duplicate and not ordered ids)', async () => {
      const { allIds } = require('./funnel-expected-responses');
      await request(app)
        .get('/funnel/usersbystep')
        .send([3, 2, 1, 3])
        .expect(httpStatus.OK)
        .then(({ body }) => {
          expect(body).to.deep.equal(allIds);
        });
    });
  });
});
