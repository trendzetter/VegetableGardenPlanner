(function () {
  'use strict';

  // Configuring the Friends Admin module
  angular
    .module('friends.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Friends',
      state: 'admin.friends.list'
    });
  }
}());
