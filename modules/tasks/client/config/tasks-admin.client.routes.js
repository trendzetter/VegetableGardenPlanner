(function () {
  'use strict';

  angular
    .module('tasks.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.tasks', {
        abstract: true,
        url: '/tasks',
        template: '<ui-view/>'
      })
      .state('admin.tasks.list', {
        url: '',
        templateUrl: '/modules/tasks/client/views/admin/list-tasks.client.view.html',
        controller: 'TasksAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.tasks.create', {
        url: '/create',
        templateUrl: '/modules/tasks/client/views/admin/form-task.client.view.html',
        controller: 'TasksAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          taskResolve: newTask
        }
      })
      .state('admin.tasks.edit', {
        url: '/:taskId/edit',
        templateUrl: '/modules/tasks/client/views/admin/form-task.client.view.html',
        controller: 'TasksAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          taskResolve: getTask
        }
      });
  }

  getTask.$inject = ['$stateParams', 'TasksService'];

  function getTask($stateParams, TasksService) {
    return TasksService.get({
      taskId: $stateParams.taskId
    }).$promise;
  }

  newTask.$inject = ['TasksService'];

  function newTask(TasksService) {
    return new TasksService();
  }
}());
