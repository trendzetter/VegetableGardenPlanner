(function () {
  'use strict';

  angular
    .module('plantfamilies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
 /*   Menus.addMenuItem('topbar', {
      title: 'Plant families',
      state: 'plantfamilies',
      type: 'dropdown',
      roles: ['*']
    });*/

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'manage', {
      title: 'List plant families',
      state: 'plantfamilies.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'manage', {
      title: 'Add plant family',
      state: 'plantfamilies.create',
      roles: ['user']
    });
  }
})();
