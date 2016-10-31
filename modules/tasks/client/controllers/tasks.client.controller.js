(function () {
  'use strict';

  angular
    .module('tasks')
    .controller('TasksController', TasksController);

  TasksController.$inject = ['$scope', 'taskResolve', 'Authentication'];

  function TasksController($scope, task, Authentication) {
    var vm = this;

    vm.task = task;
    vm.authentication = Authentication;
    vm.error = null;

  }
}());
