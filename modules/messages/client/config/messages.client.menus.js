 (function () {
   'use strict';

   angular
    .module('messages')
    .run(menuConfig);

   menuConfig.$inject = ['menuService'];

   function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'messages',
      state: 'messages',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'messages', {
      title: 'list_messages',
      state: 'messages.list',
      roles: ['user']
    });
  }
 }());
