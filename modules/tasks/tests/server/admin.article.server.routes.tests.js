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
describe('Task Admin CRUD tests', function () {
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

    // Save a user to the test db and create new task
    user.save(function () {
      task = {
        title: 'Task Title',
        content: 'Task Content'
      };

      done();
    });
  });

  it('should be able to save an task if logged in', function (done) {
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

        // Save a new task
        agent.post('/api/tasks')
          .send(task)
          .expect(200)
          .end(function (taskSaveErr, taskSaveRes) {
            // Handle task save error
            if (taskSaveErr) {
              return done(taskSaveErr);
            }

            // Get a list of tasks
            agent.get('/api/tasks')
              .end(function (tasksGetErr, tasksGetRes) {
                // Handle task save error
                if (tasksGetErr) {
                  return done(tasksGetErr);
                }

                // Get tasks list
                var tasks = tasksGetRes.body;

                // Set assertions
                (tasks[0].user._id).should.equal(userId);
                (tasks[0].title).should.match('Task Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an task if signed in', function (done) {
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

        // Save a new task
        agent.post('/api/tasks')
          .send(task)
          .expect(200)
          .end(function (taskSaveErr, taskSaveRes) {
            // Handle task save error
            if (taskSaveErr) {
              return done(taskSaveErr);
            }

            // Update task title
            task.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing task
            agent.put('/api/tasks/' + taskSaveRes.body._id)
              .send(task)
              .expect(200)
              .end(function (taskUpdateErr, taskUpdateRes) {
                // Handle task update error
                if (taskUpdateErr) {
                  return done(taskUpdateErr);
                }

                // Set assertions
                (taskUpdateRes.body._id).should.equal(taskSaveRes.body._id);
                (taskUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an task if no title is provided', function (done) {
    // Invalidate title field
    task.title = '';

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

        // Save a new task
        agent.post('/api/tasks')
          .send(task)
          .expect(400)
          .end(function (taskSaveErr, taskSaveRes) {
            // Set message assertion
            (taskSaveRes.body.message).should.match('Title cannot be blank');

            // Handle task save error
            done(taskSaveErr);
          });
      });
  });

  it('should be able to delete an task if signed in', function (done) {
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

        // Save a new task
        agent.post('/api/tasks')
          .send(task)
          .expect(200)
          .end(function (taskSaveErr, taskSaveRes) {
            // Handle task save error
            if (taskSaveErr) {
              return done(taskSaveErr);
            }

            // Delete an existing task
            agent.delete('/api/tasks/' + taskSaveRes.body._id)
              .send(task)
              .expect(200)
              .end(function (taskDeleteErr, taskDeleteRes) {
                // Handle task error error
                if (taskDeleteErr) {
                  return done(taskDeleteErr);
                }

                // Set assertions
                (taskDeleteRes.body._id).should.equal(taskSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single task if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new task model instance
    task.user = user;
    var taskObj = new Task(task);

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

        // Save a new task
        agent.post('/api/tasks')
          .send(task)
          .expect(200)
          .end(function (taskSaveErr, taskSaveRes) {
            // Handle task save error
            if (taskSaveErr) {
              return done(taskSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (taskInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
