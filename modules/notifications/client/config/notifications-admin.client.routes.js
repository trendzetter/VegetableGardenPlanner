(function () {
  'use strict';

  angular
    .module('notifications.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
 /*     .state('admin.notifications', {
        abstract: true,
        url: '/notifications',
        template: '<ui-view/>'
      })*/
      .state('admin.notifications.list', {
        url: '',
        templateUrl: '/modules/notifications/client/views/admin/list-notifications.client.view.html',
        controller: 'NotificationsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.notifications.create', {
        url: '/create',
        templateUrl: '/modules/notifications/client/views/admin/form-notification.client.view.html',
        controller: 'NotificationsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          notificationResolve: newNotification
        }
      })
      .state('admin.notifications.edit', {
        url: '/:notificationId/edit',
        templateUrl: '/modules/notifications/client/views/admin/form-notification.client.view.html',
        controller: 'NotificationsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          notificationResolve: getNotification
        }
      });
  }

  getNotification.$inject = ['$stateParams', 'NotificationsService'];

  function getNotification($stateParams, NotificationsService) {
    return NotificationsService.get({
      notificationId: $stateParams.notificationId
    }).$promise;
  }

  newNotification.$inject = ['NotificationsService'];

  function newNotification(NotificationsService) {
    return new NotificationsService();
  }
}());
