(function () {
  'use strict';

  angular
    .module('gardens')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Gardens',
      state: 'gardens',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'List Gardens',
      state: 'listGardens'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'Create Garden',
      state: 'createGarden',
      roles: ['user']
    });
  }
})();
