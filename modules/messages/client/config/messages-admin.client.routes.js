(function () {
  'use strict';

  angular
    .module('messages.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
 /*     .state('admin.messages', {
        abstract: true,
        url: '/messages',
        template: '<ui-view/>'
      })*/
      .state('admin.messages.list', {
        url: '',
        templateUrl: '/modules/messages/client/views/admin/list-messages.client.view.html',
        controller: 'MessagesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.messages.create', {
        url: '/create',
        templateUrl: '/modules/messages/client/views/admin/form-message.client.view.html',
        controller: 'MessagesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          messageResolve: newMessage
        }
      })
      .state('admin.messages.edit', {
        url: '/:messageId/edit',
        templateUrl: '/modules/messages/client/views/admin/form-message.client.view.html',
        controller: 'MessagesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          messageResolve: getMessage
        }
      });
  }

  getMessage.$inject = ['$stateParams', 'MessagesService'];

  function getMessage($stateParams, MessagesService) {
    return MessagesService.get({
      messageId: $stateParams.messageId
    }).$promise;
  }

  newMessage.$inject = ['MessagesService'];

  function newMessage(MessagesService) {
    return new MessagesService();
  }
}());
