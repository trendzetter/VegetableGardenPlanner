'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Task = mongoose.model('Task'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  task;

/**
 * Task routes tests
 */
describe('Task CRUD tests', function () {

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

    // Save a user to the test db and create new task
    user.save(function () {
      task = {
        title: 'Task Title',
        content: 'Task Content'
      };

      done();
    });
  });

  it('should not be able to save an task if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tasks')
          .send(task)
          .expect(403)
          .end(function (taskSaveErr, taskSaveRes) {
            // Call the assertion callback
            done(taskSaveErr);
          });

      });
  });

  it('should not be able to save an task if not logged in', function (done) {
    agent.post('/api/tasks')
      .send(task)
      .expect(403)
      .end(function (taskSaveErr, taskSaveRes) {
        // Call the assertion callback
        done(taskSaveErr);
      });
  });

  it('should not be able to update an task if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tasks')
          .send(task)
          .expect(403)
          .end(function (taskSaveErr, taskSaveRes) {
            // Call the assertion callback
            done(taskSaveErr);
          });
      });
  });

  it('should be able to get a list of tasks if not signed in', function (done) {
    // Create new task model instance
    var taskObj = new Task(task);

    // Save the task
    taskObj.save(function () {
      // Request tasks
      request(app).get('/api/tasks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single task if not signed in', function (done) {
    // Create new task model instance
    var taskObj = new Task(task);

    // Save the task
    taskObj.save(function () {
      request(app).get('/api/tasks/' + taskObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', task.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single task with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tasks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Task is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single task which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent task
    request(app).get('/api/tasks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No task with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an task if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/tasks')
          .send(task)
          .expect(403)
          .end(function (taskSaveErr, taskSaveRes) {
            // Call the assertion callback
            done(taskSaveErr);
          });
      });
  });

  it('should not be able to delete an task if not signed in', function (done) {
    // Set task user
    task.user = user;

    // Create new task model instance
    var taskObj = new Task(task);

    // Save the task
    taskObj.save(function () {
      // Try deleting task
      request(app).delete('/api/tasks/' + taskObj._id)
        .expect(403)
        .end(function (taskDeleteErr, taskDeleteRes) {
          // Set message assertion
          (taskDeleteRes.body.message).should.match('User is not authorized');

          // Handle task error error
          done(taskDeleteErr);
        });

    });
  });

  it('should be able to get a single task that has an orphaned user reference', function (done) {
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

          // Save a new task
          agent.post('/api/tasks')
            .send(task)
            .expect(200)
            .end(function (taskSaveErr, taskSaveRes) {
              // Handle task save error
              if (taskSaveErr) {
                return done(taskSaveErr);
              }

              // Set assertions on new task
              (taskSaveRes.body.title).should.equal(task.title);
              should.exist(taskSaveRes.body.user);
              should.equal(taskSaveRes.body.user._id, orphanId);

              // force the task to have an orphaned user reference
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

                    // Get the task
                    agent.get('/api/tasks/' + taskSaveRes.body._id)
                      .expect(200)
                      .end(function (taskInfoErr, taskInfoRes) {
                        // Handle task error
                        if (taskInfoErr) {
                          return done(taskInfoErr);
                        }

                        // Set assertions
                        (taskInfoRes.body._id).should.equal(taskSaveRes.body._id);
                        (taskInfoRes.body.title).should.equal(task.title);
                        should.equal(taskInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single task if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new task model instance
    var taskObj = new Task(task);

    // Save the task
    taskObj.save(function () {
      request(app).get('/api/tasks/' + taskObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', task.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single task, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'taskowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Task
    var _taskOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _taskOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Task
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

          // Save a new task
          agent.post('/api/tasks')
            .send(task)
            .expect(200)
            .end(function (taskSaveErr, taskSaveRes) {
              // Handle task save error
              if (taskSaveErr) {
                return done(taskSaveErr);
              }

              // Set assertions on new task
              (taskSaveRes.body.title).should.equal(task.title);
              should.exist(taskSaveRes.body.user);
              should.equal(taskSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the task
                  agent.get('/api/tasks/' + taskSaveRes.body._id)
                    .expect(200)
                    .end(function (taskInfoErr, taskInfoRes) {
                      // Handle task error
                      if (taskInfoErr) {
                        return done(taskInfoErr);
                      }

                      // Set assertions
                      (taskInfoRes.body._id).should.equal(taskSaveRes.body._id);
                      (taskInfoRes.body.title).should.equal(task.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (taskInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Task.remove().exec(done);
    });
  });
});
