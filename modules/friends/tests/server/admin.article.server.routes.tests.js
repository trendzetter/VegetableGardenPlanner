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
describe('Friend Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an friend if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new friend
        agent.post('/api/friends')
          .send(friend)
          .expect(200)
          .end(function (friendSaveErr, friendSaveRes) {
            // Handle friend save error
            if (friendSaveErr) {
              return done(friendSaveErr);
            }

            // Get a list of friends
            agent.get('/api/friends')
              .end(function (friendsGetErr, friendsGetRes) {
                // Handle friend save error
                if (friendsGetErr) {
                  return done(friendsGetErr);
                }

                // Get friends list
                var friends = friendsGetRes.body;

                // Set assertions
                (friends[0].user._id).should.equal(userId);
                (friends[0].title).should.match('Friend Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an friend if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new friend
        agent.post('/api/friends')
          .send(friend)
          .expect(200)
          .end(function (friendSaveErr, friendSaveRes) {
            // Handle friend save error
            if (friendSaveErr) {
              return done(friendSaveErr);
            }

            // Update friend title
            friend.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing friend
            agent.put('/api/friends/' + friendSaveRes.body._id)
              .send(friend)
              .expect(200)
              .end(function (friendUpdateErr, friendUpdateRes) {
                // Handle friend update error
                if (friendUpdateErr) {
                  return done(friendUpdateErr);
                }

                // Set assertions
                (friendUpdateRes.body._id).should.equal(friendSaveRes.body._id);
                (friendUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an friend if no title is provided', function (done) {
    // Invalidate title field
    friend.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new friend
        agent.post('/api/friends')
          .send(friend)
          .expect(422)
          .end(function (friendSaveErr, friendSaveRes) {
            // Set message assertion
            (friendSaveRes.body.message).should.match('Title cannot be blank');

            // Handle friend save error
            done(friendSaveErr);
          });
      });
  });

  it('should be able to delete an friend if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new friend
        agent.post('/api/friends')
          .send(friend)
          .expect(200)
          .end(function (friendSaveErr, friendSaveRes) {
            // Handle friend save error
            if (friendSaveErr) {
              return done(friendSaveErr);
            }

            // Delete an existing friend
            agent.delete('/api/friends/' + friendSaveRes.body._id)
              .send(friend)
              .expect(200)
              .end(function (friendDeleteErr, friendDeleteRes) {
                // Handle friend error error
                if (friendDeleteErr) {
                  return done(friendDeleteErr);
                }

                // Set assertions
                (friendDeleteRes.body._id).should.equal(friendSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single friend if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new friend model instance
    friend.user = user;
    var friendObj = new Friend(friend);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new friend
        agent.post('/api/friends')
          .send(friend)
          .expect(200)
          .end(function (friendSaveErr, friendSaveRes) {
            // Handle friend save error
            if (friendSaveErr) {
              return done(friendSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (friendInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
