(function () {
  'use strict';

  angular
    .module('plantfamilies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'system', {
      title: 'list_plant_families',
      state: 'plantfamilies.list'
    });

    // Add the dropdown create item
   /* Menus.addSubMenuItem('topbar', 'system', {
      title: 'add_plant_family',
      state: 'plantfamilies.create',
      roles: ['user']
    });*/
  }
}());
