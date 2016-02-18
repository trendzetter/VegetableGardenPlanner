'use strict';

angular.module('gardenparts').directive('plantvarietyimage', ['$rootScope',
  function($rootScope) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.plantVarietyClicked = function() {
          $rootScope.$broadcast('addPlantvariety', scope.plantvariety);
        };
      }
    };
  }
]);
