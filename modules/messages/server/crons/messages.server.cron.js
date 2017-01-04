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
  Message = mongoose.model('Message');

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

function sendEmail(user, message) {
      email.to = user.email;
      text = text.replace('{{name}}', user.displayName);
      email.text = email.html = text.replace('{{content}}', message.content);

      console.log('trying to send email');
      transporter.sendMail(email, emailCallback(user));
    }

function emailCallback(message) {
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
          message.sendEmail = true;
          message.save();
        }

      };
    }
/**
 * Create a cron
 */
exports.invokeTask = function (req, res) {
  var task = cron.schedule('55 * * * * *', function() {
          console.log('You will see this message 60 secs from messagescron');
          User.find({ emailMessage: true }, '_id displayName email', function(err, users) {

                for (var i = 0; i < users.length; i++) {
                  var user = users[i];
                  console.log('user' + JSON.stringify(user));
                  Message.find({ user: user._id, sendEmail: null }).select('content').exec(function(err, messages) {
                    for (var j = 0; j < messages.length; j++) {
                      var message = messages[j];
                      console.log('message' + JSON.stringify(message));
                      email.to = user.email;
                      text = text.replace('{{name}}', user.displayName);
                      email.text = email.html = text.replace('{{content}}', message.content);

                      console.log('trying to send email');
                      transporter.sendMail(email, emailCallback(message));
                      sleep(10000);


                    }
                  });
                }
              });
        }, null, true, 'America/Los_Angeles');
};
