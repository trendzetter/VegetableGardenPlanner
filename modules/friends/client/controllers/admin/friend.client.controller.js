(function () {
  'use strict';

  angular
    .module('friends.admin')
    .controller('FriendsAdminController', FriendsAdminController);

  FriendsAdminController.$inject = ['$scope', '$state', '$window', 'friendResolve', 'Authentication', 'Notification'];

  function FriendsAdminController($scope, $state, $window, friend, Authentication, Notification) {
    var vm = this;

    vm.friend = friend;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Friend
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.friend.$remove(function() {
          $state.go('admin.friends.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Friend deleted successfully!' });
        });
      }
    }

    // Save Friend
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.friendForm');
        return false;
      }

      // Create a new friend, or update the current instance
      vm.friend.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.friends.list'); // should we send the User to the list or the updated Friend's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Friend saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Friend save error!' });
      }
    }
  }
}());
