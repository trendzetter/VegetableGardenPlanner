 (function () {
  'use strict';

  angular
    .module('friends')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'friends',
      state: 'friends',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'friends', {
      title: 'List Friends',
      state: 'friends.list',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'friends', {
      title: 'Search Friends',
      state: 'friends.search',
      roles: ['user']
    });
  }
}());
