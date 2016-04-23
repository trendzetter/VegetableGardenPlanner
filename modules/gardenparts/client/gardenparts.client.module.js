(function (app) {
  'use strict';

  app.registerModule('gardenparts');
  app.registerModule('gardenparts.services');
  app.registerModule('gardenparts.routes', ['ui.router', 'gardenparts.services']);
}(ApplicationConfiguration));
