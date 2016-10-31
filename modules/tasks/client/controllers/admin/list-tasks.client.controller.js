(function () {
  'use strict';

  angular
    .module('tasks.admin')
    .controller('TasksAdminListController', TasksAdminListController);

  TasksAdminListController.$inject = ['TasksService'];

  function TasksAdminListController(TasksService) {
    var vm = this;

    vm.tasks = TasksService.query();
  }
}());
