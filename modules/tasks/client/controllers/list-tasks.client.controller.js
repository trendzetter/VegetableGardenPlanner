(function () {
  'use strict';

  angular
    .module('tasks')
    .controller('TasksListController', TasksListController);

  TasksListController.$inject = ['TasksService'];

  function TasksListController(TasksService) {
    var vm = this;
    var data = TasksService.query();
    data.$promise.then(function(){
      vm.tasks = data.tasks ;
      vm.varieties = {};
      for(var i = 0 ; i < data.varieties.length ; i ++ ){
        vm.varieties[data.varieties[i]._id] = data.varieties[i];
      }
    });

  }
}());
