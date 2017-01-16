(function () {
  'use strict';

  angular
    .module('friends.admin')
    .controller('FriendsAdminListController', FriendsAdminListController);

  FriendsAdminListController.$inject = ['FriendsService'];

  function FriendsAdminListController(FriendsService) {
    var vm = this;

    vm.friends = FriendsService.query();
  }
}());
