'use strict';

/**
 * Module dependencies
 */
var cron = require('node-cron'),
  config = require('../../../../config/config'),
  path = require('path'),
  mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  Garden = mongoose.model('Garden'),
  Message = mongoose.model('Message');

function daydiff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}
/**
 * Create a cron
 */
exports.invokeTask = function (req, res) {
  var task = cron.schedule('0 0 0 * * *', function () {
    console.log('You will see this message every day from taskscron');
    var now = new Date();
    var gardenids = [];
    Garden.find({ validFrom: { '$lte': now }, validTo: null }).select('bk name').exec(function (err, gardens) {
      if (err) {
        console.log('error taskcron: ' + err.errmsg + err.code);
      }

      for (var i = 0; i < gardens.length; i++) {
        var garden = gardens[i];
        console.log('garden: ' + garden.bk + garden.name);
        Task.find({ garden: garden.bk, status: { '$in': ['NEW', 'PENDING'] }, validFrom: { '$lt': now } }).populate('cultivationPlan').exec(function (err, tasks) {

          for (var j = 0; j < tasks.length; j++) {
            var task = tasks[j];
            console.log('task._id: ' + task._id);
            console.log('task.validFrom: ' + task.validFrom);
            console.log('now: ' + now);
            var timeDiff = Math.abs(now.getTime() - task.validFrom.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            console.log('diffDays: ' + diffDays);

            console.log('task.cultivationPlan.step].maxduration: ' + task.cultivationPlan.steps[task.step].maxduration);
            console.log('task.cultivationPlan.step].minduration: ' + task.cultivationPlan.steps[task.step].minduration);
            if (task.cultivationPlan.steps[task.step].maxduration <= diffDays) {
              if ((task.step + 1) === task.cultivationPlan.steps.length) {
                console.log('last step, don t create new one ');
              } else {
                var newtask = new Task();
                newtask.cultivationPlan = task.cultivationPlan._id;
                newtask.garden = task.garden;
                newtask.planting = task.planting;
                newtask.step = task.step + 1;
                newtask.status = 'NEW';
                newtask.validFrom = now;
                newtask.user = task.user;
                newtask.save(function(err, newtask) {
                  // create message for new task
                  var message = new Message();
                  message.title = task.cultivationPlan.steps[newtask.step].title;
                  message.content = 'De volgede stap van het teeltplan is begonnen. Bekijk de details hier. ' + config.domain + '/tasks/' + newtask._id;
                  message.task = newtask._id;
                  message.user = newtask.user;
                  message.save();
                });
                task.status = 'UNKNOWN';
                task.save();
              }
            } else {
              if (task.cultivationPlan.steps[task.step].minduration === diffDays) {
                // create message warning that it's about time to move to the next step
                var message = new Message();
                message.title = task.cultivationPlan.steps[task.step].title;
                message.content = 'Vanaf nu mag je naar de volgende stap gaan in het teeltplan. Bekijk de details van de huidige stap. http://' + config.domain + '/tasks/' + task._id;
                message.task = task._id;
                message.user = task.user;
                message.save();
              }
            }
          }
        });
      }
    });
  }, null, true, 'America/Los_Angeles');
};
