'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  PlantVariety = mongoose.model('PlantVariety'),
  Planting = mongoose.model('Planting'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an task
 */
exports.create = function (req, res) {
  var task = new Task(req.body);
  task.user = req.user;

  task.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(task);
    }
  });
};

/**
 * Show the current task
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var task = req.task ? req.task.toJSON() : {};

  // Add a custom field to the Task, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Task model.
  task.isCurrentUserOwner = !!(req.user && task.user && task.user._id.toString() === req.user._id.toString());

  res.json(task);
};

exports.confirm = function (req, res) {
  // convert mongoose document to JSON
  var task = req.task;

  task.status = 'FINISHED';
  console.log('task: ' + JSON.stringify(task));
  task.save();

  if (task.step < task.cultivationPlan.steps.length) {
    // create a task for the next step of the cultivationPlan
    var newtask = new Task();
    newtask.user = req.user;
    newtask.status = 'NEW';
    newtask.step = task.step + 1;
    newtask.cultivationPlan = new mongoose.Types.ObjectId(task.cultivationPlan._id);
    newtask.garden = task.garden;
    newtask.planting = task.planting;
    newtask.save(function (err) {
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Planting.findOneAndUpdate({'_id': task.planting},{'cultivationPlanStep': newtask.step},function(){
        console.log('updating the planting after finish the task failed'); 
      });
      res.json(newtask);
    }
    });
  } else {
    res.json(task);
  }
};

/**
 * Update an task
 */
exports.update = function (req, res) {
  var task = req.task;

  task.title = req.body.title;
  task.content = req.body.content;

  task.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(task);
    }
  });
};

/**
 * Delete an task
 */
exports.delete = function (req, res) {
  var task = req.task;

  task.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(task);
    }
  });
};

/**
 * List of Tasks
 */
exports.list = function (req, res) {
  var data = {};
  Task.find({ status: 'NEW', validFrom: { '$lte': Date.now() }, user: req.user }).sort('-created').populate('cultivationPlan').exec(function (err, tasks) {
    var varietiesobj = {};
    for (var i = 0; i < tasks.length; i++) {
      var id = tasks[i].cultivationPlan.variety;
      varietiesobj[id] = true;
    }

    var varietyids = Object.keys(varietiesobj);
    console.log('varietyids: ' + varietyids);

    PlantVariety.find({ _id: { $in: varietyids } }).exec(function(err, varieties) {
      console.log('crops: ' + JSON.stringify(varieties));
      data.varieties = varieties;
      if (err) {
                return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
              } else {
                data.tasks = tasks;
                res.json(data);
              }
    });


  });
};

/**
 * Task middleware
 */
exports.taskByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Task is invalid'
    });
  }

  Task.findById(id).populate('user cultivationPlan').exec(function (err, task) {
    if (err) {
      return next(err);
    } else if (!task) {
      return res.status(404).send({
        message: 'No task with that identifier has been found'
      });
    }
    req.task = task;
    next();
  });
};
