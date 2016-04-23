'use strict';

angular.module('gardenparts').directive('zoomable', ['$rootScope',
  function($rootScope) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        // fix to make it work with the old gardenpart view/controller
        if (!scope.vm) {
          scope.vm = {};
        }
        // TODO: better calculation of the default zoom
        //  var windowWidth = window.innerWidth - window.innerWidth/10;
        //  scope.zoom = Math.floor(windowWidth/scope.gardenpart.elemwidth);
        scope.vm.zoom = 1;
        var broadcastZoom = function() {
          // fix to make it work with the old gardenpart view/controller
          scope.zoom = scope.vm.zoom;
          console.log('zoomIn!' + scope.vm.zoom);
          // send the signal to the rulers
          $rootScope.$broadcast('updatedZoom', scope.vm.zoom);
        };
        scope.$on('plantingsLoaded', function() {
          console.log('plantingsLoaded in plantingpart');
          scope.vm.zoom = 2;
          broadcastZoom();
        });

        scope.zoomIn = function() {
          scope.vm.zoom += 0.2;
          broadcastZoom();
        };

        scope.zoomOut = function() {
          scope.vm.zoom -= 0.2;
          broadcastZoom();
        };
      }
    };
  }
]);
