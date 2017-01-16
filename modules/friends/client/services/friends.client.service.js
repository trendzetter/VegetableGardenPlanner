(function () {
  'use strict';

  angular
    .module('friends.services')
    .factory('FriendsService', FriendsService);

  FriendsService.$inject = ['$resource', '$log'];

  function FriendsService($resource, $log) {
    var Friend = $resource('/api/friends/:friendId', {
      friendId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Friend.prototype, {
      createOrUpdate: function () {
        var friend = this;
        return createOrUpdate(friend);
      }
    });

    return Friend;

    function createOrUpdate(friend) {
      if (friend._id) {
        return friend.$update(onSuccess, onError);
      } else {
        return friend.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(friend) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
