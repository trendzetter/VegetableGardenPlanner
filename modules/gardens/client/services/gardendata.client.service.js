'use strict';

angular.module('gardens').factory('Gardendata', [
  function() {
    var garden;
    var error;

    return {
      setGarden: function(arg) {
        garden = arg;
      },
      getGarden: function() {
        return garden;
      },
      setError: function(arg) {
        error = arg;
      },
      getError: function() {
        return error;
      }
    };
  }
]);
