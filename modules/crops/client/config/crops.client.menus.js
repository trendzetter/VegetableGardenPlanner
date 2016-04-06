(function () {
  'use strict';

  angular
    .module('crops')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Manage',
      state: 'manage',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'manage', {
      title: 'List crops',
      state: 'crops.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'manage', {
      title: 'Add crop',
      state: 'crops.create',
      roles: ['user']
    });
  }
})();
