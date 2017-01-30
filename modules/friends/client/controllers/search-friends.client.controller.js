(function () {
  'use strict';

  angular
    .module('friends')
    .controller('FriendsSearchController', FriendsSearchController);

  FriendsSearchController.$inject = ['FriendsService'];

  function FriendsSearchController(FriendsService) {
    var vm = this;
    vm.search = search;

   function search(){
        FriendsService.search({friendName: vm.friendname}).then(function(users){
            vm.users = users;
        });
    };
  }
}());
