(function () {
  'use strict';

  angular
    .module('cultivation-plans')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
   /* menuService.addMenuItem('topbar', {
      title: 'Teelwijzen',
      state: 'cultivation-plans',
      type: 'dropdown',
      roles: ['*']
    });
*/
    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'system', {
      title: 'list_cultivation_plans',
      state: 'cultivation-plans.list'
    });

    // Add the dropdown create item
/*    menuService.addSubMenuItem('topbar', 'system', {
      title: 'add_cultivation_plan',
      state: 'cultivation-plans.create',
      roles: ['user']
    });*/
  }
}());
