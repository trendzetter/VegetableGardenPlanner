(function (app) {
  'use strict';

  app.registerModule('crops');
  app.registerModule('crops.services');
  app.registerModule('crops.routes', ['ui.router', 'crops.services']);
})(ApplicationConfiguration);
