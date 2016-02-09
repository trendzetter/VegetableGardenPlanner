(function (app) {
  'use strict';

  app.registerModule('plant-varieties');
  app.registerModule('plant-varieties.services');
  app.registerModule('plant-varieties.routes', ['ui.router', 'plant-varieties.services']);
})(ApplicationConfiguration);
