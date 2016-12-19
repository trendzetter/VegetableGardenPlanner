(function () {
  'use strict';

  angular
    .module('gardens')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {

    Menus.addMenuItem('topbar', {
      title: 'vegetable_garden',
      state: 'gardens',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'list_vegetable_gardens',
      state: 'listGardens'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'create_vegetable_garden',
      state: 'createGarden',
      roles: ['user']
    });
  }
}());
