(function (app) {
  'use strict';

  app.registerModule('rule-sets');
  app.registerModule('rule-sets.services');
  app.registerModule('rule-sets.routes', ['ui.router', 'rule-sets.services']);
})(ApplicationConfiguration);
