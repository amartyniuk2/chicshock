/* eslint-disable @typescript-eslint/no-var-requires */
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

const should = require('should');

describe('Testing authentication resolvers, services and modules', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll((done) => {
    app.close();
    done();
  });

  describe('[Authentication]', () => {
    it('should create account and return access token for user who does not have one', async () => {
      const query = `
        mutation {
            signup(data: {email: "mafikizolo@simpson.com", password: "secret44442", username: "mafikizolo", signupType: "email"}) {
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
          should(res.body.data.signup).have.property('accessToken');
        });
    });

    it('should not create account for user who already has one', async () => {
      const query = `
        mutation {
            signup(data: {email: "mafikizolo@simpson.com", password: "secret44442", username: "mafikizolo", signupType: "email"}) {
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
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal(
            'email/username already in use.'
          );
        });
    });

    it('should not create account when email/username is not supplied', async () => {
      const query = `
          mutation {
            signup(data: {password: "secret44442", signupType: "email"}) {
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
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal(
            'please provide email or username and password'
          );
        });
    });
    it('should not create account when password is not supplied', async () => {
      const query = `
          mutation {
            signup(data: {email: "mafikizolo@simpson.com", username: "mafikizolo", signupType: "email"}) {
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
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal(
            'please provide a password'
          );
        });
    });
    it('should login and return token for an existing user when provided username/email and password', async () => {
      const query = `
          mutation {
            login(data: {email: "mafikizolo@simpson.com", password: "secret44442"}) {
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
          should(res.body.data.login).have.property('accessToken');
        });
    });
    it('should not login a non existant user', async () => {
      const query = `
          mutation {
            login(data: {email: "mafikizogo@simpson.com", password: "secret44442"}) {
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
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal(
            'No user found with these credentials, please signup'
          );
        });
    });
    it('should not login user when wrong password is fed into the input', async () => {
      const query = `
          mutation {
            login(data: {email: "mafikizolo@simpson.com", password: "secrt44442"}) {
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
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal('Invalid password');
        });
    });
  });
});
