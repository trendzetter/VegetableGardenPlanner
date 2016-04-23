(function (app) {
  'use strict';

  app.registerModule('harvests');
  app.registerModule('harvests.services');
  app.registerModule('harvests.routes', ['ui.router', 'harvests.services']);
}(ApplicationConfiguration));
