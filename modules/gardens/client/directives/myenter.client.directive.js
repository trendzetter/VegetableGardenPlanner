'use strict';

angular.module('gardens').directive('myenter', [
  function() {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.bind('keydown keypress', function(event) {
          if (event.which === 13) {
            scope.$apply(function() {
              scope.addKeeper();
            });

            event.preventDefault();
          }
        });
      }
    };
  }
]);
