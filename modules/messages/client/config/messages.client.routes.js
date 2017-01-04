(function () {
  'use strict';

  angular
    .module('messages.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('messages', {
        abstract: true,
        url: '/messages',
        template: '<ui-view/>'
      })
      .state('messages.list', {
        url: '',
        templateUrl: '/modules/messages/client/views/list-messages.client.view.html',
        controller: 'MessagesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Messages List'
        }
      })
      .state('messages.view', {
        url: '/:messageId',
        templateUrl: '/modules/messages/client/views/view-message.client.view.html',
        controller: 'MessagesController',
        controllerAs: 'vm',
        resolve: {
          messageResolve: getMessage
        },
        data: {
          pageTitle: 'Message {{ messageResolve.title }}'
        }
      });
  }

  getMessage.$inject = ['$stateParams', 'MessagesService'];

  function getMessage($stateParams, MessagesService) {
    return MessagesService.get({
      messageId: $stateParams.messageId
    }).$promise;
  }
}());
