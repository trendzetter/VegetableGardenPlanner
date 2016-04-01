(function () {
  'use strict';

  angular
    .module('crops')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Crops',
      state: 'crops',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'crops', {
      title: 'List crops',
      state: 'crops.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'crops', {
      title: 'Create crop',
      state: 'crops.create',
      roles: ['user']
    });
  }
})();
