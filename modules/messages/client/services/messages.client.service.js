(function () {
  'use strict';

  angular
    .module('messages.services')
    .factory('MessagesService', MessagesService);

  MessagesService.$inject = ['$resource'];

  function MessagesService($resource) {
    var Message = $resource('/api/messages/:messageId', {
      messageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Message.prototype, {
      createOrUpdate: function () {
        var message = this;
        return createOrUpdate(message);
      }
    });

    return Message;

    function createOrUpdate(message) {
      if (message._id) {
        return message.$update(onSuccess, onError);
      } else {
        return message.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(message) {
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
