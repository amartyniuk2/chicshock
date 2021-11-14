/* eslint-disable @typescript-eslint/no-var-requires */
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

const should = require('should');

describe('Testing users resolvers, services and modules', () => {
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

  describe('Users [friends]', () => {
    let friendship: any;
    it('should add friend/send friend request', async () => {
      const query = `
                  mutation {
                        addFriend (friendId: "ckudjdcua0000f6162ezr8ydg") {
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
          should(res.body.data.addFriend).have.property('message');
          should(res.body.data.addFriend.message).be.equal(
            'successfully sent friend request'
          );
        });
    });
    it('should return true and friendship for when friend is already added while checking for friendship', async () => {
      const query = `
                    query {
                        checkIfFriendAlreadyAdded (userId: "ckudjdcua0000f6162ezr8ydg") {
                            isFriended
                            friendship {
                                id
                                friendshipStatus
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
          friendship = res.body.data.checkIfFriendAlreadyAdded.friendship;
          should(res.body.data.checkIfFriendAlreadyAdded).have.property(
            'isFriended'
          );
          should(res.body.data.checkIfFriendAlreadyAdded).have.property(
            'friendship'
          );
          should(
            res.body.data.checkIfFriendAlreadyAdded.friendship
          ).have.property('friendshipStatus');
          should(
            res.body.data.checkIfFriendAlreadyAdded.friendship.friendshipStatus
          ).be.equal('WAITING');
          should(res.body.data.checkIfFriendAlreadyAdded.isFriended).be.equal(
            true
          );
        });
    });
    it('should return false for when friend is not added while checking for friendship', async () => {
      const query = `
                      query {
                          checkIfFriendAlreadyAdded (userId: "ckudjdcua0000f6162ezr18ydg") {
                              isFriended
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
          should(res.body.data.checkIfFriendAlreadyAdded).have.property(
            'isFriended'
          );
          should(res.body.data.checkIfFriendAlreadyAdded.isFriended).be.equal(
            false
          );
        });
    });
    it('should accept friendship', async () => {
      const query = `
              mutation {
                  updateFriendRequest (friendshipId: "${friendship.id}", data: { friendshipStatus: "ACCEPTED" }) {
                      message
                      friendship {
                          friendshipStatus
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
          should(res.body.data.updateFriendRequest.message).be.equal(
            'successfully updated friend request'
          );
          should(res.body.data.updateFriendRequest.friendship).have.property(
            'friendshipStatus'
          );
          should(
            res.body.data.updateFriendRequest.friendship.friendshipStatus
          ).be.equal('ACCEPTED');
        });
    });
    it('should decline friendship', async () => {
      const query = `
                mutation {
                    updateFriendRequest (friendshipId: "${friendship.id}", data: { friendshipStatus: "DECLINED" }) {
                        message
                        friendship {
                          friendshipStatus
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
          should(res.body.data.updateFriendRequest.message).be.equal(
            'successfully updated friend request'
          );
          should(res.body.data.updateFriendRequest.friendship).have.property(
            'friendshipStatus'
          );
          should(
            res.body.data.updateFriendRequest.friendship.friendshipStatus
          ).be.equal('DECLINED');
        });
    });
    it('should remove added friend', async () => {
      const query = `
                      mutation {
                          removeFriend (friendId: "ckudjdcua0000f6162ezr8ydg") {
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
          should(res.body.data.removeFriend).have.property('message');
          should(res.body.data.removeFriend.message).be.equal(
            'successfully removed friend'
          );
        });
    });
    it('should not add friend/send friend request to user who does not exist', async () => {
      const query = `
                mutation {
                        addFriend (friendId: "ckudjdcua0000f6162ezr18ydg") {
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
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal(
            'failed to send friend request'
          );
        });
    });
    it('should not remove friend for user who does not exist', async () => {
      const query = `
                  mutation {
                          removeFriend (friendId: "ckudjdcua0000f6162ezr18ydg") {
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
          should(res.body.data.removeFriend.message).be.equal(
            'you must be friends with this user to perform this operation'
          );
        });
    });
    it('should not remove friend when not supplied a friend id', async () => {
      const query = `
                    mutation {
                            removeFriend {
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
            'Field "removeFriend" argument "friendId" of type "String!" is required, but it was not provided.'
          );
        });
    });
    it('should not add friend/send friend request to user when not provided a friendId', async () => {
      const query = `
                  mutation {
                          addFriend {
                          message
                      }
                  }
              `;

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query,
        })
        .expect(400)
        .expect((res) => {
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal(
            'Field "addFriend" argument "friendId" of type "String!" is required, but it was not provided.'
          );
        });
    });
    it('should not update friendship status of a friendship that does not exists', async () => {
      const query = `
                mutation {
                    updateFriendRequest (friendshipId: "friendship.id", data: { friendshipStatus: "DECLINED" }) {
                        message
                        friendship {
                          friendshipStatus
                        }
                    }
                }
            `;

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query,
        })
        .expect(200)
        .expect((res) => {
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal(
            'failed to update friend request'
          );
        });
    });
  });

  describe('Users [follows]', () => {
    it('should follow another user', async () => {
      const query = `
                mutation {
                    followUser (userId: "ckudjdcua0000f6162ezr8ydg") {
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
          should(res.body.data.followUser).have.property('message');
          should(res.body.data.followUser.message).be.equal(
            'successfully followed this user'
          );
        });
    });
    it('should check if follow exists or not', async () => {
      const query = `
                    query {
                      checkIfFollowAlreadyExists (userId: "ckudjdcua0000f6162ezr8ydg") {
                            isFollowExistant
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
          should(res.body.data.checkIfFollowAlreadyExists).have.property(
            'isFollowExistant'
          );
          should(
            res.body.data.checkIfFollowAlreadyExists.isFollowExistant
          ).be.equal(true);
        });
    });
    it('should return false if follow does not exists', async () => {
      const query = `
                      query {
                        checkIfFollowAlreadyExists (userId: "ckudjdcua0000f6162ezr9ydg") {
                            isFollowExistant
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
          should(res.body.data.checkIfFollowAlreadyExists).have.property(
            'isFollowExistant'
          );
          should(
            res.body.data.checkIfFollowAlreadyExists.isFollowExistant
          ).be.equal(false);
        });
    });
    it('should not follow another user that is already being followed by this same user', async () => {
      const query = `
                  mutation {
                      followUser (userId: "ckudjdcua0000f6162ezr8ydg") {
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
          should(res.body.data.followUser).have.property('message');
          should(res.body.data.followUser.message).be.equal(
            'you are already following this user'
          );
        });
    });
    it('should not follow another user whose id does not exist', async () => {
      const query = `
                    mutation {
                        followUser (userId: "ckudjdcua0000f6162ezr18ydg") {
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
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal(
            'failed to follow this user'
          );
        });
    });
    it('should unfollow user being followed', async () => {
      const query = `
                mutation {
                    unFollowUser (userId: "ckudjdcua0000f6162ezr8ydg") {
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
          should(res.body.data.unFollowUser).have.property('message');
          should(res.body.data.unFollowUser.message).be.equal(
            'successfully unfollowed this user'
          );
        });
    });
    it('should not unfollow after already unfollowing them', async () => {
      const query = `
                  mutation {
                      unFollowUser (userId: "ckudjdcua0000f6162ezr8ydg") {
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
          should(res.body.data.unFollowUser.message).be.equal(
            'you are not following this user'
          );
        });
    });
    it('should not unfollow user whose id does not exist', async () => {
      const query = `
                      mutation {
                          unFollowUser (userId: "ckudjdcua0000f6162ezr18ydg") {
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
          should(res.body.data.unFollowUser.message).be.equal(
            'you are not following this user'
          );
        });
    });
  });

  describe('Users [Profile]', () => {
    it('should fetch profile of currently authenticated user', async () => {
      const query = `
          query {
            me {
              message
              user {
                  id
                  email
                  firstName
                  lastName
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
          should(res.body.data.me).have.property('message');
          should(res.body.data.me).have.property('user');
          should(res.body.data.me.user).have.property('id');
          should(res.body.data.me.user).have.property('email');
        });
    });
    it('should not fetch profile for un-authenticated user', async () => {
      const query = `
            query {
              me {
                message
                user {
                  id
                }
              }
            }
          `;

      return request(app.getHttpServer())
        .post('/graphql')
        .expect(200)
        .set('Authorization', 'Bearer ${accessToken}')
        .send({
          query,
        })
        .expect((res) => {
          should(res.body.errors.length).be.greaterThan(0);
          should(res.body.errors[0].message).be.equal('Unauthorized');
        });
    });
    it('should be able to fetch profile relationships when fetching profile', async () => {
      const query = `
            query {
              me {
                message
                user {
                  followers {
                      id
                  }
                  following {
                      id
                  }
                  posts {
                      id
                  }
                  voted {
                      id
                  }
                  friends {
                      id
                  }
                  friended {
                      id
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
          should(res.body.data.me).have.property('message');
          should(res.body.data.me).have.property('user');
          should(res.body.data.me.user).have.property('followers');
          should(res.body.data.me.user).have.property('following');
          should(res.body.data.me.user).have.property('posts');
          should(res.body.data.me.user).have.property('friends');
          should(res.body.data.me.user).have.property('friended');
          should(res.body.data.me.user).have.property('voted');
        });
    });
    it('should fetch profile given valid user id', async () => {
      const query = `
          query {
              fetchProfile (userId: "ckudjdcua0000f6162ezr8ydg") {
                  message
                  user {
                          id
                          email
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
          should(res.body.data.fetchProfile).have.property('message');
          should(res.body.data.fetchProfile).have.property('user');
          should(res.body.data.fetchProfile.user).have.property('id');
          should(res.body.data.fetchProfile.user).have.property('email');
        });
    });
    it('should update user/profile for currently logged in user', async () => {
      const query = `
            mutation {
                updateUser (data: { profilePicture: "djdjdjdjdjdj" }) {
                    message
                    user {
                            profilePicture
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
          should(res.body.data.updateUser).have.property('message');
          should(res.body.data.updateUser).have.property('user');
          should(res.body.data.updateUser.user).have.property('profilePicture');
          should(res.body.data.updateUser.user.profilePicture).be.equal(
            'djdjdjdjdjdj'
          );
        });
    });
    it('should not update user/profile when not supplied data', async () => {
      const query = `
              mutation {
                  updateUser {
                      message
                      user {
                            profilePicture
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
            'Field "updateUser" argument "data" of type "UpdateUserInput!" is required, but it was not provided.'
          );
        });
    });
    it('should not fetch profile given wrong user id', async () => {
      const query = `
            query {
              fetchProfile (userId: "ckudtdcua0000f6162ezr8ydg") {
                  message
                  user {
                      id
                      email
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
            'failed to fetch user profile'
          );
        });
    });
  });
});
