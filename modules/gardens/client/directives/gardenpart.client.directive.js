'use strict';
/*global $:false */
var getCoordinates = function(elem) {
  var el = $(elem);
  var co = {};
  co.top = el.css('top').replace('px', '');
  co.left = el.css('left').replace('px', '');
  co.height = el.css('height').replace('px', '');
  co.width = el.css('width').replace('px', '');
  return co;
};


angular.module('gardens').directive('gardenpart', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, elem, attrs) {

        scope.popoverEvent = function() {
          $timeout(function() {
            elem.trigger('customEvent');
          }, 0);
        };

        var updateCoordinates = function() {
          var co = getCoordinates(elem);
          scope.update(co.top, co.left, co.width, co.height);
          scope.$apply();
        };

        var resizeStop = function() {
          scope.gardenpart.modified = true;
          console.log('modified:' + JSON.stringify(scope.gardenpart));
          updateCoordinates();
        };

        elem.addClass(scope.gardenpart.type);

        if (attrs.gardenpart === 'layout') {
          var resizableConfig = {
            containment: '#garden',
            autoHide: false,
            snap: true,
            snapmode: 'outer',
            stop: resizeStop,
            resize: updateCoordinates
          };
          switch (scope.gardenpart.type) {
            case 'hweg':
              resizableConfig.minHeight = 25;
              resizableConfig.maxHeight = 60;
              resizableConfig.handles = 'n,s,e,w';
              break;
            case 'vweg':
              resizableConfig.minWidth = 25;
              resizableConfig.maxWidth = 60;
              resizableConfig.handles = 'n,s,e,w';
              break;
            case 'akke':
              resizableConfig.minHeight = 50;
              resizableConfig.minWidth = 50;
              resizableConfig.handles = 'n,s,e,w';
              break;
            case 'vbed':
              resizableConfig.minWidth = 60;
              resizableConfig.maxWidth = 120;
              resizableConfig.handles = 'n,s,e,w';
              break;
            case 'hbed':
              resizableConfig.minHeight = 60;
              resizableConfig.maxHeight = 120;
              resizableConfig.handles = 'n,s,w,e';
              break;
            default:
              console.log('you shouldnt get here default case in switch gardenpart directive' + JSON.stringify(scope.gardenpart));
          }
          elem.resizable(resizableConfig);
          elem.droppable();

          // Enkel bij nieuwe gardenparts
          if (typeof scope.gardenpart.bk === 'undefined') {
            switch (scope.gardenpart.type) {
              case 'hweg':
                scope.update(0, 0, 150, 30);
                break;
              case 'vweg':
                scope.update(0, 0, 30, 150);
                break;
              case 'akke':
                scope.update(0, 0, 50, 50);
                break;
              case 'vbed':
                scope.update(0, 0, 100, 200);
                break;
              case 'hbed':
                scope.update(0, 0, 200, 100);
                break;
              default:
                console.log('you shouldnt get here default case in switch gardenpart directive' + JSON.stringify(scope.gardenpart));
            }
            var draggableConfig = {
              animate: true,
              grid: [1, 1],
              containment: 'parent',
              revert: 'valid',
              snap: '.gardenpart ',
              snapmode: 'outer'
            };
            draggableConfig.drag = updateCoordinates;
            elem.draggable(draggableConfig);
          }
        }
      }
    };
  }
]);
