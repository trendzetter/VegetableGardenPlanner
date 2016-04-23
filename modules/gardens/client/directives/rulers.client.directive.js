'use strict';

angular.module('gardens').directive('rulers', ['$timeout', '$window',
  function($timeout, $window) {
    return {
      template: '<div class="ruler corner"></div>' +
        '<div class="ruler vRule1" ><div ng-repeat="vbox in vboxes" class="vRuleBox">{{vbox}}</div></div>' +
        '<div class="ruler vRule" ></div>' +
        '<div class="ruler hRule1" ><div ng-repeat="hbox in hboxes" class="hRuleBox">{{hbox}}</div></div>' +
        '<div class="ruler hRule"/>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var parent = element.parent();

        var render = function(zoom) {
          if (typeof zoom === 'undefined')
            zoom = 1;
          parent.height($window.innerHeight);
          scope.hboxes = [];
          scope.vboxes = [];
          $timeout(function() {
            scope.nrhbox = $window.innerWidth / 50;
            scope.nrvbox = $window.innerHeight / 50;
            var i;
            for (i = 0; i < scope.nrhbox; i++) {
              scope.hboxes.push(Math.round((i * 50) / zoom));
            }
            for (i = 0; i < scope.nrvbox; i++) {
              scope.vboxes.push(Math.round((i * 50) / zoom));
            }
            parent.css('background', 'url("/modules/gardens/client/img/il-grid-trans.png") repeat scroll left top #fff');
          });

        };


        scope.$on('$destroy', function(event) {
          parent.css('background', '');
        });

        render();
        scope.$on('updatedZoom', function(event, zoom) {
          render(zoom);
        });
      }
    };
  }
]);
