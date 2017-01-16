'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Friend = mongoose.model('Friend'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  friend;

/**
 * Friend routes tests
 */
describe('Friend CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new friend
    user.save(function () {
      friend = {
        title: 'Friend Title',
        content: 'Friend Content'
      };

      done();
    });
  });

  it('should not be able to save an friend if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/friends')
          .send(friend)
          .expect(403)
          .end(function (friendSaveErr, friendSaveRes) {
            // Call the assertion callback
            done(friendSaveErr);
          });

      });
  });

  it('should not be able to save an friend if not logged in', function (done) {
    agent.post('/api/friends')
      .send(friend)
      .expect(403)
      .end(function (friendSaveErr, friendSaveRes) {
        // Call the assertion callback
        done(friendSaveErr);
      });
  });

  it('should not be able to update an friend if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/friends')
          .send(friend)
          .expect(403)
          .end(function (friendSaveErr, friendSaveRes) {
            // Call the assertion callback
            done(friendSaveErr);
          });
      });
  });

  it('should be able to get a list of friends if not signed in', function (done) {
    // Create new friend model instance
    var friendObj = new Friend(friend);

    // Save the friend
    friendObj.save(function () {
      // Request friends
      request(app).get('/api/friends')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single friend if not signed in', function (done) {
    // Create new friend model instance
    var friendObj = new Friend(friend);

    // Save the friend
    friendObj.save(function () {
      request(app).get('/api/friends/' + friendObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', friend.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single friend with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/friends/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Friend is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single friend which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent friend
    request(app).get('/api/friends/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No friend with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an friend if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/friends')
          .send(friend)
          .expect(403)
          .end(function (friendSaveErr, friendSaveRes) {
            // Call the assertion callback
            done(friendSaveErr);
          });
      });
  });

  it('should not be able to delete an friend if not signed in', function (done) {
    // Set friend user
    friend.user = user;

    // Create new friend model instance
    var friendObj = new Friend(friend);

    // Save the friend
    friendObj.save(function () {
      // Try deleting friend
      request(app).delete('/api/friends/' + friendObj._id)
        .expect(403)
        .end(function (friendDeleteErr, friendDeleteRes) {
          // Set message assertion
          (friendDeleteRes.body.message).should.match('User is not authorized');

          // Handle friend error error
          done(friendDeleteErr);
        });

    });
  });

  it('should be able to get a single friend that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new friend
          agent.post('/api/friends')
            .send(friend)
            .expect(200)
            .end(function (friendSaveErr, friendSaveRes) {
              // Handle friend save error
              if (friendSaveErr) {
                return done(friendSaveErr);
              }

              // Set assertions on new friend
              (friendSaveRes.body.title).should.equal(friend.title);
              should.exist(friendSaveRes.body.user);
              should.equal(friendSaveRes.body.user._id, orphanId);

              // force the friend to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the friend
                    agent.get('/api/friends/' + friendSaveRes.body._id)
                      .expect(200)
                      .end(function (friendInfoErr, friendInfoRes) {
                        // Handle friend error
                        if (friendInfoErr) {
                          return done(friendInfoErr);
                        }

                        // Set assertions
                        (friendInfoRes.body._id).should.equal(friendSaveRes.body._id);
                        (friendInfoRes.body.title).should.equal(friend.title);
                        should.equal(friendInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single friend if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new friend model instance
    var friendObj = new Friend(friend);

    // Save the friend
    friendObj.save(function () {
      request(app).get('/api/friends/' + friendObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', friend.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single friend, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'friendowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Friend
    var _friendOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _friendOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Friend
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new friend
          agent.post('/api/friends')
            .send(friend)
            .expect(200)
            .end(function (friendSaveErr, friendSaveRes) {
              // Handle friend save error
              if (friendSaveErr) {
                return done(friendSaveErr);
              }

              // Set assertions on new friend
              (friendSaveRes.body.title).should.equal(friend.title);
              should.exist(friendSaveRes.body.user);
              should.equal(friendSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the friend
                  agent.get('/api/friends/' + friendSaveRes.body._id)
                    .expect(200)
                    .end(function (friendInfoErr, friendInfoRes) {
                      // Handle friend error
                      if (friendInfoErr) {
                        return done(friendInfoErr);
                      }

                      // Set assertions
                      (friendInfoRes.body._id).should.equal(friendSaveRes.body._id);
                      (friendInfoRes.body.title).should.equal(friend.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (friendInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Friend.remove().exec(done);
    });
  });
});
