(function () {
  'use strict';

  // Configuring the Messages Admin module
  angular
    .module('messages.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Messages',
      state: 'admin.messages.list'
    });
  }
}());
