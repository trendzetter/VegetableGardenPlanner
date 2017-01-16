(function (app) {
  'use strict';

  app.registerModule('friends', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('friends.admin', ['core.admin']);
  app.registerModule('friends.admin.routes', ['core.admin.routes']);
  app.registerModule('friends.services');
  app.registerModule('friends.routes', ['ui.router', 'core.routes', 'friends.services']);
}(ApplicationConfiguration));
