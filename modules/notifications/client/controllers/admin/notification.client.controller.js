(function () {
  'use strict';

  angular
    .module('notifications.admin')
    .controller('NotificationsAdminController', NotificationsAdminController);

  NotificationsAdminController.$inject = ['$scope', '$state', '$window', 'notificationResolve', 'Authentication'];

  function NotificationsAdminController($scope, $state, $window, notification, Authentication) {
    var vm = this;

    vm.notification = notification;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Notification
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.notification.$remove(function() {
          $state.go('admin.notifications.list');
        });
      }
    }

    // Save Notification
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.notificationForm');
        return false;
      }

      // Create a new notification, or update the current instance
      vm.notification.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.notifications.list'); // should we send the User to the list or the updated Notification's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
