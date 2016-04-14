(function () {
  'use strict';

  angular
    .module('plant-varieties')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Plant varieteiten',
      state: 'plant-varieties',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'plant-varieties', {
      title: 'Lijst varieteiten',
      state: 'plant-varieties.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'plant-varieties', {
      title: 'Variëteit toevoegen',
      state: 'plant-varieties.create',
      roles: ['user']
    });
  }
})();
