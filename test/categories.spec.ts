/* eslint-disable @typescript-eslint/no-var-requires */
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

const should = require('should');

describe('Testing categories resolvers, services and modules', () => {
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

  describe('[Categories]', () => {
    it('should fetch all categories', async () => {
      const query = `
        query {
            fetchCategories {
                id
                posts {
                    id
                    title
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
          should(res.body.data.fetchCategories.length).be.greaterThan(0);
        });
    });
    it('should fetch posts together with categories', async () => {
      const query = `
          query {
              fetchCategories {
                  id
                  posts {
                    id
                    title
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
          should(res.body.data.fetchCategories.length).be.greaterThan(0);
          should(res.body.data.fetchCategories[0]).have.property('id');
          should(res.body.data.fetchCategories[0]).have.property('posts');
        });
    });
    it('should fetch a single category given a valid id ', async () => {
      const query = `
          query {
            fetchCategory (categoryId: "ckui5ks6v0066ut16orgyxdch") {
                id
                posts {
                    id
                    title
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
          should(res.body.data.fetchCategory).have.property('id');
          should(res.body.data.fetchCategory).have.property('posts');
        });
    });
    it('should not fetch a single category given a wrong id ', async () => {
      const query = `
            query {
              fetchCategory (categoryId: "ckui5ks6v0066ut16orgyddch") {
                  id
                  posts {
                      id
                      title
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
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal(
            'Cannot return null for non-nullable field Query.fetchCategory.'
          );
        });
    });
    it('should not fetch a single category given not id ', async () => {
      const query = `
              query {
                fetchCategory {
                    id
                    posts {
                        id
                        title
                    }
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
            'Field "fetchCategory" argument "categoryId" of type "String!" is required, but it was not provided.'
          );
        });
    });
    it('should create a category given name', async () => {
      const query = `
            mutation {
              createCategory (data: { name: "Spinach"}) {
                  id
                  name
                  createdAt
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
          should(res.body.data.createCategory).have.property('id');
          should(res.body.data.createCategory).have.property('name');
          should(res.body.data.createCategory).have.property('createdAt');
        });
    });
    it('should not create a category without a name', async () => {
      const query = `
            mutation {
                createCategory (data: {}) {
                    id
                    name
                    createdAt
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
            'Field "CreateCategoryInput.name" of required type "String!" was not provided.'
          );
        });
    });
    it('should not update a category without an id', async () => {
      const query = `
              mutation {
                  updateCategory (data: {}) {
                    id
                    name
                    createdAt
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
            'Field "UpdateCategoryInput.id" of required type "String!" was not provided.'
          );
        });
    });
    it('should update a category given a correct category id', async () => {
      const query = `
              mutation {
                updateCategory (data: { id: "ckui5ks6v0066ut16orgyxdch", name: "molecules"}) {
                    id
                    name
                    createdAt
                    updatedAt
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
          should(res.body.data.updateCategory).have.property('id');
          should(res.body.data.updateCategory).have.property('name');
          should(res.body.data.updateCategory.name).be.equal('molecules');
          should(res.body.data.updateCategory).have.property('updatedAt');
        });
    });
    it('should not delete a category without an id', async () => {
      const query = `
                mutation {
                    deleteCategory {
                      id
                      name
                      createdAt
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
            'Field "deleteCategory" argument "categoryId" of type "String!" is required, but it was not provided.'
          );
        });
    });
    it('should not delete an id of a category that does not exist ', async () => {
      const query = `
              mutation {
                deleteCategory (categoryId: "ckui5ks6v0066ut76orgyddch") {
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
          should(res.body.errors[0].message).be.equal(
            'failed to delete category'
          );
        });
    });
    it('should delete a category given a correct category id', async () => {
      const query = `
            mutation {
                deleteCategory (categoryId: "ckui5ks6v0066ut16orgyxdch") {
                    id
                    name
                    createdAt
                    updatedAt
                    isActive
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
          should(res.body.data.deleteCategory).have.property('id');
          should(res.body.data.deleteCategory).have.property('name');
          should(res.body.data.deleteCategory.isActive).be.equal(false);
          should(res.body.data.deleteCategory).have.property('updatedAt');
        });
    });
  });
});
