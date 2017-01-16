(function () {
  'use strict';

  angular
    .module('friends.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
 /*     .state('admin.friends', {
        abstract: true,
        url: '/friends',
        template: '<ui-view/>'
      })*/
      .state('admin.friends.list', {
        url: '',
        templateUrl: '/modules/friends/client/views/admin/list-friends.client.view.html',
        controller: 'FriendsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.friends.create', {
        url: '/create',
        templateUrl: '/modules/friends/client/views/admin/form-friend.client.view.html',
        controller: 'FriendsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          friendResolve: newFriend
        }
      })
      .state('admin.friends.edit', {
        url: '/:friendId/edit',
        templateUrl: '/modules/friends/client/views/admin/form-friend.client.view.html',
        controller: 'FriendsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          friendResolve: getFriend
        }
      });
  }

  getFriend.$inject = ['$stateParams', 'FriendsService'];

  function getFriend($stateParams, FriendsService) {
    return FriendsService.get({
      friendId: $stateParams.friendId
    }).$promise;
  }

  newFriend.$inject = ['FriendsService'];

  function newFriend(FriendsService) {
    return new FriendsService();
  }
}());
