(function () {
  'use strict';

  angular
    .module('notifications.services')
    .factory('NotificationsService', NotificationsService);

  NotificationsService.$inject = ['$resource'];

  function NotificationsService($resource) {
    var Notification = $resource('/api/notifications/:notificationId', {
      notificationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Notification.prototype, {
      createOrUpdate: function () {
        var notification = this;
        return createOrUpdate(notification);
      }
    });

    return Notification;

    function createOrUpdate(notification) {
      if (notification._id) {
        return notification.$update(onSuccess, onError);
      } else {
        return notification.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(notification) {
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
      console.log(error);
    }
  }
}());
