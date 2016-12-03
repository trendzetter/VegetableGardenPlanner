'use strict';

/**
 * Module dependencies
 */
var cron = require('node-cron'),
  config = require('../../../../config/config'),
  nodemailer = require('nodemailer'),
  path = require('path'),
  mongoose = require('mongoose'),
  Task = mongoose.model('Task'),
  User = mongoose.model('User'),
  Notification = mongoose.model('Notification');

var transporter = nodemailer.createTransport(config.mailer.options);
var link = 'reset link here'; // PUT reset link here
var email = {
    from: config.mailer.from,
    subject: 'Een nieuwe bericht van Vegetable Garden Planner'
  };
var text = [
    'Beste {{name}},',
    '\n',
    '{{content}}',
    link,
    '\n',
    'Vriendelijke groet,',
    'Het Vegetable Garden Planner team'
  ].join('\n');

function sendEmail(user, notification) {
      email.to = user.email;
      text = text.replace('{{name}}', user.displayName);
      email.text = email.html = text.replace('{{content}}', notification.content);

      console.log('trying to send email');
      transporter.sendMail(email, emailCallback(user));
    }

function emailCallback(notification) {
      return function (err, info) {
        console.log('error' + err);
    /*    processedCount++;*/

        if (err) {
          // errorCount++;
          console.log('Error: ', err);
          if (config.mailer.options.debug) {
            console.log('Error: ', err);
          }
         // console.error('[' + processedCount + '/' + users.length + '] ' + chalk.red('Could not send email for ' + user.displayName));
        } else {
          notification.sendEmail = true;
          notification.save();
        }

      };
    }
/**
 * Create a cron
 */
exports.invokeTask = function (req, res) {
  var task = cron.schedule('55 * * * * *', function() {
          console.log('You will see this message 60 secs from notificationscron');
          User.find({ emailNotification: true }, '_id displayName email', function(err, users) {

                for (var i = 0; i < users.length; i++) {
                  var user = users[i];
                  console.log('user' + JSON.stringify(user));
                  Notification.find({ user: user._id, sendEmail: null }).select('content').exec(function(err, notifications) {
                    for (var j = 0; j < notifications.length; j++) {
                      var notification = notifications[j];
                      console.log('notification' + JSON.stringify(notification));
                      email.to = user.email;
                      text = text.replace('{{name}}', user.displayName);
                      email.text = email.html = text.replace('{{content}}', notification.content);

                      console.log('trying to send email');
                      transporter.sendMail(email, emailCallback(notification));
                      sleep(10000);


                    }
                  });
                }
              });
        }, null, true, 'America/Los_Angeles');
};
