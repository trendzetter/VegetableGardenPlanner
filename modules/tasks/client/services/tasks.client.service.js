(function () {
  'use strict';

  angular
    .module('tasks.services')
    .factory('TasksService', TasksService);

  TasksService.$inject = ['$resource'];

  function TasksService($resource) {
    var Task = $resource('/api/tasks/:taskId', {
      taskId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      confirm: {
        method: 'POST'
      },
      query: {
        isArray: false
      }
    });

    angular.extend(Task.prototype, {
      createOrUpdate: function () {
        var task = this;
        return createOrUpdate(task);
      }
    });

    return Task;

    function createOrUpdate(task) {
      if (task._id) {
        return task.$update(onSuccess, onError);
      } else {
        return task.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(task) {
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
