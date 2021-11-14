/* eslint-disable @typescript-eslint/no-var-requires */
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

const should = require('should');

describe('Testing posts resolvers, services and modules', () => {
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
        login(data: {email: "kilsa@simpson.com", password: "secret42"}) {
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

  describe('[Posts]', () => {
    it('should fetch wall for non-authenticated users', async () => {
      const query = `
        query {
          fetchWall {
            id
            photos
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
          should(res.body.data.fetchWall.length).be.greaterThan(0);
        });
    });

    it('should fetch posts for logged in user', async () => {
      const query = `
        query {
          fetchUserPosts {
            id
            photos
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
          should(res.body.data.fetchUserPosts.length).be.greaterThan(0);
        });
    });

    it('should fetch post by id', async () => {
      const query = `
        query {
          fetchPostById(postId: "ckui5ks6v0066ut16orgymdch") {
            id
            photos
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
          should(res.body.data.fetchPostById.id).be.equal(
            'ckui5ks6v0066ut16orgymdch'
          );
        });
    });

    it('should throw error when fetching post with id that does not exists', async () => {
      const query = `
        query {
          fetchPostById(postId: "ckui5ks6v0066ut16orgymdcx") {
            id
            photos
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
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal(
            'failed to fetch post by id'
          );
        });
    });

    it('should fetch posts by user id', async () => {
      const query = `
        query {
          fetchPostsByUserId(userId: "ckudjdcua0000f6162ezr9ydg") {
            id
            photos
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
          should(res.body.data.fetchPostsByUserId.length).be.greaterThan(0);
        });
    });

    it('should fetch posts by user id', async () => {
      const query = `
        query {
          fetchPostsByUserId(userId: "ckudjdcua0000f6162ezr9ydg") {
            id
            photos
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
          should(res.body.data.fetchPostsByUserId.length).be.greaterThan(0);
        });
    });

    it('should not fetch posts when given wrong user id', async () => {
      const query = `
        query {
          fetchPostsByUserId(userId: "ckudjdcua0000f6162ezr10ydg") {
            id
            photos
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
          should(res.body.data.fetchPostsByUserId.length).be.equal(0);
        });
    });

    it('should create post with non-optional fields', async () => {
      const query = `
        mutation {
          createPost(data: { title: "title", photos: ["jdjdjdjdj"], postType: "MAKEOVER" }) {
            id
            photos
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
          should(res.body.data.createPost).have.property('id');
        });
    });

    it('should create post with a photos array', async () => {
      const query = `
        mutation {
          createPost(data: { title: "title" }) {
            id
            photos
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
            'Field "CreatePostsInput.photos" of required type "[String!]!" was not provided.'
          );
        });
    });

    it('should update post with right id', async () => {
      const query = `
        mutation {
          updatePost(data: { id: "ckui5ks6v0066ut16orgymdch", title: "title updated" }) {
            id
            photos
            title
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
          should(res.body.data.updatePost.title).be.equal('title updated');
        });
    });

    it('should not update post with non-existant id id', async () => {
      const query = `
        mutation {
          updatePost(data: { id: "ckui5ks6v0066ut16orgymdcxx", title: "title updated" }) {
            id
            photos
            title
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
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal('failed to update post');
        });
    });

    it('should delete existant post', async () => {
      const query = `
        mutation {
          deletePost(postId: "ckui5ks6v0066ut16orgymdch") {
            id
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
          should(res.body.data.deletePost).have.property('id');
        });
    });

    it('should not delete post with wrong id', async () => {
      const query = `
        mutation {
          deletePost(postId: "ckui5ks6v0066ut16orgymdcb") {
            id
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
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal('failed to delete post');
        });
    });
  });
});
