/* eslint-disable @typescript-eslint/no-var-requires */
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

const should = require('should');

describe('Testing votes resolvers, services and modules', () => {
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

  describe('[Votes]', () => {
    it('should vote on post when provided post id and vote type', async () => {
      const query = `
        mutation {
          votePost (data: { voteType: "VERYCOOL", postId: "ckui5ks6v0066ut16orgymdch" }) {
            message
            votes {
                voteType
                post {
                    id
                    title
                }
            }
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
          should(res.body.data.votePost).have.property('message');
          should(res.body.data.votePost).have.property('votes');
          should(res.body.data.votePost.votes).have.property('voteType');
          should(res.body.data.votePost.votes.voteType).be.equal('VERYCOOL');
        });
    });

    it('should fetch votes on a post', async () => {
      const query = `
          query {
            fetchVotesOnPost (postId: "ckui5ks6v0066ut16orgymdch") {
              votes {
                voteType
                post {
                    id
                    title
                }
              }
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
          should(res.body.data.fetchVotesOnPost).have.property('votes');
          should(res.body.data.fetchVotesOnPost.votes.length).be.greaterThan(0);
        });
    });

    it('should un vote post that has already been voted by this user', async () => {
      const query = `
          mutation {
            unVotePost (postId: "ckui5ks6v0066ut16orgymdch") {
              message
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
          should(res.body.data.unVotePost).have.property('message');
          should(res.body.data.unVotePost.message).be.equal(
            'successfully un voted post'
          );
        });
    });

    it('should not un vote post that has already been voted by this user', async () => {
      const query = `
            mutation {
              unVotePost (postId: "ckui5ks6v0066ut16orgymdch") {
                message
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
          should(res.body.data.unVotePost).have.property('message');
          should(res.body.data.unVotePost.message).be.equal(
            'please vote on post inorder to use this operation'
          );
        });
    });

    it('should not vote post without providing a valid post id', async () => {
      const query = `
              mutation {
                votePost (data: { voteType: "VERYCOOL" }) {
                  message
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
            'Field "VoteInput.postId" of required type "String!" was not provided.'
          );
        });
    });

    it('should not vote post without providing a vote type', async () => {
      const query = `
            mutation {
                votePost (data: { postId: "ckui5ks6v0066ut16orgymdch" }) {
                message
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
            'Field "VoteInput.voteType" of required type "String!" was not provided.'
          );
        });
    });

    it('should not un vote post without providing a valid post id', async () => {
      const query = `
              mutation {
                  unVotePost (postId: "ckui5ks6v0066ut76orgymdch") {
                    message
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
          should(res.body.data.unVotePost).have.property('message');
          should(res.body.data.unVotePost.message).be.equal(
            'please vote on post inorder to use this operation'
          );
        });
    });

    it('should not un vote post without providing a post id', async () => {
      const query = `
              mutation {
                  unVotePost {
                    message
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
            'Field "unVotePost" argument "postId" of type "String!" is required, but it was not provided.'
          );
        });
    });
  });
});
