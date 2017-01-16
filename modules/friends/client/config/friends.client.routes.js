(function () {
  'use strict';

  angular
    .module('friends.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('friends', {
        abstract: true,
        url: '/friends',
        template: '<ui-view/>'
      })
      .state('friends.list', {
        url: '',
        templateUrl: '/modules/friends/client/views/list-friends.client.view.html',
        controller: 'FriendsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Friends List'
        }
      })
      .state('friends.search', {
        url: '',
        templateUrl: '/modules/friends/client/views/search-friends.client.view.html',
        controller: 'FriendsSearchController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Friends Search'
        }
      })
      .state('friends.view', {
        url: '/:friendId',
        templateUrl: '/modules/friends/client/views/view-friend.client.view.html',
        controller: 'FriendsController',
        controllerAs: 'vm',
        resolve: {
          friendResolve: getFriend
        },
        data: {
          pageTitle: 'Friend {{ friendResolve.title }}'
        }
      });
  }

  getFriend.$inject = ['$stateParams', 'FriendsService'];

  function getFriend($stateParams, FriendsService) {
    return FriendsService.get({
      friendId: $stateParams.friendId
    }).$promise;
  }
}());
