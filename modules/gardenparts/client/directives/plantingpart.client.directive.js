'use strict';

angular.module('gardenparts').directive('zoomable', ['$rootScope',
  function($rootScope) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var broadcastZoom = function() {
          scope.$broadcast('updatedZoom');
          $rootScope.$broadcast('updatedZoom', scope.zoom);
        };
        scope.$on('plantingsLoaded', function() {
          console.log('plantingsLoaded in plantingpart');
          //TODO: better calculation of the default zoom
          //  var windowWidth = window.innerWidth - window.innerWidth/10;
          //  scope.zoom = Math.floor(windowWidth/scope.gardenpart.elemwidth);
          scope.zoom = 2;
          broadcastZoom();
        });

        scope.zoomIn = function() {
          scope.zoom += 0.2;
          broadcastZoom();
        };

        scope.zoomOut = function() {
          scope.zoom -= 0.2;
          broadcastZoom();
        };
      }
    };
  }
]);
