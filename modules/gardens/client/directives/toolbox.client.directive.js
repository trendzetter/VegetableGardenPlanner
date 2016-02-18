'use strict';
/*global $:false */
angular.module('gardens').directive('toolbox', [
  function() {
    return {
      restrict: 'A',
      link: function postLink(scope, elem, attrs) {
        var toolClicked = function(tool) {
          return function() {
            scope.$apply(function() {
              scope.addNewGardenpart(tool);
            });
          };
        };
        elem.draggable();

        var hweg = $('#hweg')
          .addClass(
            'ui-toolbox-hweg ' +
            'ui-widget-content '
          );
        hweg.name = 'hweg';
        hweg.bind('click', toolClicked(hweg));

        var vweg = $('#vweg')
          .addClass(
            'ui-toolbox-vweg ' +
            'ui-widget-content '
          );
        vweg.name = 'vweg';
        vweg.bind('click', toolClicked(vweg));

        var hbed = $('#hbed')
          .addClass(
            'ui-toolbox-hbed ' +
            'ui-widget-content '
          );
        hbed.name = 'hbed';
        hbed.bind('click', toolClicked(hbed));

        var vbed = $('#vbed')
          .addClass(
            'ui-toolbox-vbed ' +
            'ui-widget-content '
          );
        vbed.name = 'vbed';
        vbed.bind('click', toolClicked(vbed));


        var akke = $('#akke')
          .addClass(
            'ui-toolbox-akke ' +
            'ui-widget-content '
          );
        akke.name = 'akke';
        akke.bind('click', toolClicked(akke));
      }
    };
  }
]);
