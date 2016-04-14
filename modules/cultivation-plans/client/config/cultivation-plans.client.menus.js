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
      title: 'Lijst teelwijzen',
      state: 'cultivation-plans.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'system', {
      title: 'Teelwijze toevoegen',
      state: 'cultivation-plans.create',
      roles: ['user']
    });
  }
}());
