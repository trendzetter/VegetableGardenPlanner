(function () {
  'use strict';

  angular
    .module('plantfamilies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'system', {
      title: 'Lijst planten families',
      state: 'plantfamilies.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'system', {
      title: 'Plant familie toevoegen',
      state: 'plantfamilies.create',
      roles: ['user']
    });
  }
}());
