(function () {
  'use strict';

  angular
    .module('rule-sets')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'system', {
      title: 'Lijst rotatieschema\'s',
      state: 'rulesets.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'system', {
      title: 'Rotatieschema creëren',
      state: 'rulesets.create',
      roles: ['user']
    });
  }
}());
