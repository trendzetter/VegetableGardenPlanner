(function () {
  'use strict';

  angular
    .module('rule-sets')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'system', {
      title: 'list_rule_sets',
      state: 'rulesets.list'
    });

    // Add the dropdown create item
  /*  menuService.addSubMenuItem('topbar', 'system', {
      title: 'create_rule_set',
      state: 'rulesets.create',
      roles: ['user']
    });*/
  }
}());
