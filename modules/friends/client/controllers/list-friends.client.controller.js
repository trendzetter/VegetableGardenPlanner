(function () {
  'use strict';

  angular
    .module('friends')
    .controller('FriendsListController', FriendsListController);

  FriendsListController.$inject = ['FriendsService'];

  function FriendsListController(FriendsService) {
    var vm = this;

    vm.friends = FriendsService.query();
  }
}());
