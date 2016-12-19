 (function () {
   'use strict';

   angular
    .module('notifications')
    .run(menuConfig);

   menuConfig.$inject = ['menuService'];

   function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'notifications',
      state: 'notifications',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'notifications', {
      title: 'list_notifications',
      state: 'notifications.list',
      roles: ['user']
    });
  }
 }());
