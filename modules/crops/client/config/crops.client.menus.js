(function () {
  'use strict';

  angular
    .module('crops')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'system',
      state: 'system',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'system', {
      title: 'list_crops',
      state: 'crops.list'
    });

    // Add the dropdown create item
  /*  Menus.addSubMenuItem('topbar', 'system', {
      title: 'add_crop',
      state: 'crops.create',
      roles: ['user']
    });*/
  }
}());
