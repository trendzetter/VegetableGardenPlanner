(function (app) {
  'use strict';

  app.registerModule('plantfamilies');
  app.registerModule('plantfamilies.services');
  app.registerModule('plantfamilies.routes', ['ui.router', 'plantfamilies.services']);
})(ApplicationConfiguration);
