(function () {
  'use strict';

  angular
    .module('messages.admin')
    .controller('MessagesAdminController', MessagesAdminController);

  MessagesAdminController.$inject = ['$scope', '$state', '$window', 'messageResolve', 'Authentication'];

  function MessagesAdminController($scope, $state, $window, message, Authentication) {
    var vm = this;

    vm.message = message;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Message
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.message.$remove(function() {
          $state.go('admin.messages.list');
        });
      }
    }

    // Save Message
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.messageForm');
        return false;
      }

      // Create a new message, or update the current instance
      vm.message.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.messages.list'); // should we send the User to the list or the updated Message's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
