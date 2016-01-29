(function (app) {
  'use strict';

  app.registerModule('gardens');
  app.registerModule('gardens.services');
  app.registerModule('gardens.routes', ['ui.router', 'gardens.services']);
})(ApplicationConfiguration);
