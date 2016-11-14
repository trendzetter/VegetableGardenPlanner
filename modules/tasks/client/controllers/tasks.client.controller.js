(function () {
  'use strict';

  angular
    .module('tasks')
    .controller('TasksController', TasksController);

  TasksController.$inject = ['$scope', 'taskResolve', 'Authentication'];

  function TasksController($scope, task, Authentication) {
    var vm = this;

    vm.task = task;
    vm.step = task.cultivationPlan.steps[task.step];
    vm.authentication = Authentication;
    vm.error = null;

    $scope.confirmTask = function(){
      console.log('confirm task: '+task);
      task.$confirm();
    }

  }
}());
