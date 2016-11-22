(function () {
  'use strict';

  // Configuring the Notifications Admin module
  angular
    .module('notifications.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Notifications',
      state: 'admin.notifications.list'
    });
  }
}());
