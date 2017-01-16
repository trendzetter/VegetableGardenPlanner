(function () {
  'use strict';

  angular
    .module('friends')
    .controller('FriendsController', FriendsController);

  FriendsController.$inject = ['$scope', 'friendResolve', 'Authentication'];

  function FriendsController($scope, friend, Authentication) {
    var vm = this;

    vm.friend = friend;
    vm.authentication = Authentication;

  }
}());
