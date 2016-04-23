(function () {
  'use strict';

  angular
    .module('crops')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Systeem',
      state: 'system',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'system', {
      title: 'Lijst gewassen',
      state: 'crops.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'system', {
      title: 'Gewas toevoegen',
      state: 'crops.create',
      roles: ['user']
    });
  }
}());
