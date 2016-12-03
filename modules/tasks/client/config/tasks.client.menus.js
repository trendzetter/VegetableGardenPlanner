 (function () {
   'use strict';

   angular
    .module('tasks')
    .run(menuConfig);

   menuConfig.$inject = ['menuService'];

   function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Tasks',
      state: 'tasks',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'tasks', {
      title: 'List Tasks',
      state: 'tasks.list',
      roles: ['user']
    });
  }
 }());
