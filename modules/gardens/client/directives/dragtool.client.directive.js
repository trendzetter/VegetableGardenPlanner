'use strict';
/* global $:false */

angular.module('gardens').directive('dragtool', [
  function() {
    // var draggableConfig = {animate: true };
    var draggableConfig = {};
    return {
      restrict: 'A',
      link: function postLink(scope, elem, attrs) {
        var css = {
          'z-index': '1040',
          'left': window.innerWidth / 2,
          'width': '240px'
        };
        elem.css(css);
        elem.draggable(draggableConfig);
        elem.addClass('col-md-2 panel panel-default dragtool');
        elem.prepend('            <div class="panel-heading glyphicon glyphicon-move" style="width: 100%">' + attrs.dragtool + '</div>');
      }
    };
  }
]);
