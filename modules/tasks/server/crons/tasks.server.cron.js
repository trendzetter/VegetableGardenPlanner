'use strict';

/**
 * Module dependencies
 */
var cron = require('node-cron'),
  path = require('path'),
  mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  Garden = mongoose.model('Garden');

  function daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
  }
/**
 * Create a cron
 */
exports.invokeTask = function (req, res) {
        var task = cron.schedule('0,30 * * * * *', function() {
              console.log('You will see this message every minute from taskscron');
              var now = new Date();
              var gardenids = [];
              Garden.find({validFrom: {'$lte': now}, validTo: null}).select('bk name').exec(function(err, gardens){
                if (err) {
                   console.log('error taskcron: '+err.errmsg+ err.code);
                }

                for(var i = 0; i< gardens.length; i++){
                  var garden = gardens[i];
                   console.log('garden: '+ garden.bk+ garden.name);
                  Task.find({garden: garden.bk,status: {'$in':['NEW','PENDING']}, validFrom: {'$lt': now}}).populate('cultivationPlan').exec(function(err,tasks){
                                     
                    for(var j=0; j < tasks.length; j++){
                      var task = tasks[j];
                      console.log('task._id: '+task._id);
                      console.log('task.validFrom: '+task.validFrom);
                      console.log('now: '+now);
                      var timeDiff = Math.abs(now.getTime() - task.validFrom.getTime());
                      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                      console.log('diffDays: '+ diffDays);
                      
                      console.log('task.cultivationPlan.step].maxduration: '+task.cultivationPlan.steps[task.step].maxduration);
                      if(task.cultivationPlan.steps[task.step].maxduration <= diffDays){
                        if((task.step+1) === task.cultivationPlan.steps.length){
                          console.log('last step, don t create new one ');
                        }else{
                          var newtask = new Task();
                          newtask.cultivationPlan = task.cultivationPlan._id;
                          newtask.garden = task.garden;
                          newtask.planting = task.planting;
                          newtask.step = task.step+1;
                          newtask.status = 'NEW';
                          newtask.validFrom = now;
                          newtask.user = task.user;
                          newtask.save();
                          
                        }

                          task.status = 'UNKNOWN';
                          task.save();
                      } 
                    }

                  });
                }
              });
            }, null, true, 'America/Los_Angeles');
};