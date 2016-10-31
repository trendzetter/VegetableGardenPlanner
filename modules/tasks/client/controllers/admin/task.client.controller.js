(function () {
  'use strict';

  angular
    .module('tasks.admin')
    .controller('TasksAdminController', TasksAdminController);

  TasksAdminController.$inject = ['$scope', '$state', '$window', 'taskResolve', 'Authentication'];

  function TasksAdminController($scope, $state, $window, task, Authentication) {
    var vm = this;

    vm.task = task;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Task
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.task.$remove(function() {
          $state.go('admin.tasks.list');
        });
      }
    }

    // Save Task
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.taskForm');
        return false;
      }

      // Create a new task, or update the current instance
      vm.task.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.tasks.list'); // should we send the User to the list or the updated Task's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
