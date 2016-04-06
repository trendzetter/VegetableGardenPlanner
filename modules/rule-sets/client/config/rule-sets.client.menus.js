(function () {
  'use strict';

  angular
    .module('rule-sets')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
 /*   menuService.addMenuItem('topbar', {
      title: 'Rule sets',
      state: 'rulesets',
      type: 'dropdown',
      roles: ['*']
    });*/

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'manage', {
      title: 'List rule sets',
      state: 'rulesets.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'manage', {
      title: 'Create rule set',
      state: 'rulesets.create',
      roles: ['user']
    });
  }
})();
