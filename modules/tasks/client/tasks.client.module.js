(function (app) {
  'use strict';

  app.registerModule('tasks', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('tasks.admin', ['core.admin']);
  app.registerModule('tasks.admin.routes', ['core.admin.routes']);
  app.registerModule('tasks.services');
  app.registerModule('tasks.routes', ['ui.router', 'core.routes', 'tasks.services']);
}(ApplicationConfiguration));
