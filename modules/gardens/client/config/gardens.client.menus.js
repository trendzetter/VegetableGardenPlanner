(function () {
  'use strict';

  angular
    .module('gardens')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {

    Menus.addMenuItem('topbar', {
      title: 'Moestuin',
      state: 'gardens',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'Lijst moestuinen',
      state: 'listGardens'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'Moestuin creëren',
      state: 'createGarden',
      roles: ['user']
    });
  }
})();
