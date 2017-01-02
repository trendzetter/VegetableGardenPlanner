(function () {
  'use strict';

  angular
    .module('notifications.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('notifications', {
        abstract: true,
        url: '/notifications',
        template: '<ui-view/>'
      })
      .state('notifications.list', {
        url: '',
        templateUrl: '/modules/notifications/client/views/list-notifications.client.view.html',
        controller: 'NotificationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Notifications List'
        }
      })
      .state('notifications.view', {
        url: '/:notificationId',
        templateUrl: '/modules/notifications/client/views/view-notification.client.view.html',
        controller: 'NotificationsController',
        controllerAs: 'vm',
        resolve: {
          notificationResolve: getNotification
        },
        data: {
          pageTitle: 'Notification {{ notificationResolve.title }}'
        }
      });
  }

  getNotification.$inject = ['$stateParams', 'NotificationsService'];

  function getNotification($stateParams, NotificationsService) {
    return NotificationsService.get({
      notificationId: $stateParams.notificationId
    }).$promise;
  }
}());
