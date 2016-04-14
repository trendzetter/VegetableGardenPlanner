(function (app) {
  'use strict';

  app.registerModule('cultivation-plans', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('cultivation-plans.services');
  app.registerModule('cultivation-plans.routes', ['ui.router', 'core.routes', 'cultivation-plans.services']);
}(ApplicationConfiguration));
