(function () {
  'use strict';

  angular
    .module('tasks.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tasks', {
        abstract: true,
        url: '/tasks',
        template: '<ui-view/>'
      })
      .state('tasks.list', {
        url: '',
        templateUrl: 'modules/tasks/client/views/list-tasks.client.view.html',
        controller: 'TasksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tasks List'
        }
      })
      .state('tasks.view', {
        url: '/:taskId',
        templateUrl: 'modules/tasks/client/views/view-task.client.view.html',
        controller: 'TasksController',
        controllerAs: 'vm',
        resolve: {
          taskResolve: getTask
        },
        data: {
          pageTitle: 'Task {{ taskResolve.title }}'
        }
      });
  }

  getTask.$inject = ['$stateParams', 'TasksService'];

  function getTask($stateParams, TasksService) {
    return TasksService.get({
      taskId: $stateParams.taskId
    }).$promise;
  }
}());
