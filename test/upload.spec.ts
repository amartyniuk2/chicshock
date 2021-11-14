/* eslint-disable @typescript-eslint/no-var-requires */
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

const should = require('should');

describe('Testing upload resolvers, services and modules', () => {
  let app: INestApplication;
  let accessToken = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    const query = `
      mutation {
        login(data: {email: "nandi@simpson.com", password: "secret42"}) {
          accessToken
        }
      }
    `;
    return request(app.getHttpServer())
      .post('/graphql')
      .expect(200)
      .send({
        query,
      })
      .expect((res) => {
        accessToken = res.body.data.login.accessToken;
        should(res.body.data.login).have.property('accessToken');
      });
  });

  afterAll((done) => {
    app.close();
    done();
  });

  describe('Upload', () => {
    it('should get a pre-signed url provided a filename', async () => {
      const query = `
        query {
            fetchPresignedURL(filename: "charlie.jpg") {
                url 
                durationToExpire
            }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .expect(200)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query,
        })
        .expect((res) => {
          should(res.body.data.fetchPresignedURL).have.property('url');
          should(res.body.data.fetchPresignedURL).have.property(
            'durationToExpire'
          );
        });
    });
    it('should not get a pre-signed url when not provided a filename', async () => {
      const query = `
          query {
              fetchPresignedURL {
                url 
                durationToExpire
              }
          }
        `;

      return request(app.getHttpServer())
        .post('/graphql')
        .expect(400)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query,
        })
        .expect((res) => {
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal(
            'Field "fetchPresignedURL" argument "filename" of type "String!" is required, but it was not provided.'
          );
        });
    });
  });
});
