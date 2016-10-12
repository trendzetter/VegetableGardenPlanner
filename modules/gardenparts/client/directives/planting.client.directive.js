'use strict';
/* global $:false */
var getCoordinates = function(elem) {
  var el = $(elem);
  var co = {};
  co.top = el.css('top').replace('px', '');
  co.left = el.css('left').replace('px', '');
  co.height = el.css('height').replace('px', '');
  co.width = el.css('width').replace('px', '');

  return co;
};

angular.module('gardenparts').directive('planting', ['$timeout',
  function($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        // Calculate the time to harvest
        var selectedDate = new Date(scope.vm.selectedDate);
        var plantingValid = new Date(scope.planting.validFrom);
        var timeDiff = Math.abs(selectedDate.getTime() - plantingValid.getTime());
        var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
        var daysHarvest = scope.planting.plantVariety.minGrowthDuration - dayDifference;
        scope.dateHarvest = new Date();
        scope.dateHarvest.setDate(selectedDate.getDate() + daysHarvest);

        var updateCoordinates = function() {
          var co = getCoordinates(element, scope.vm.zoom);
          scope.updatePlantingCoordinates(co.top / scope.vm.zoom, co.left / scope.vm.zoom, co.width / scope.vm.zoom, co.height / scope.vm.zoom);
          scope.$apply();
        };

        var updateCoordinatesStop = function() {
          var co = getCoordinates(element, scope.vm.zoom);
          scope.updatePlantingCoordinatesStop(co.top / scope.vm.zoom, co.left / scope.vm.zoom, co.width / scope.vm.zoom, co.height / scope.vm.zoom);
          scope.$apply();
        };

        var makeDraggable = function() {
          var draggableConfig = {
            stop: updateCoordinatesStop,
            drag: updateCoordinates,
            animate: true,
            grid: [1 * scope.vm.zoom, 1 * scope.vm.zoom],
            containment: 'parent',
            revert: 'valid',
            snap: '.planting ',
            snapmode: 'outer',
            snapTolerance: 5 * scope.vm.zoom
          };
          element.draggable(draggableConfig);
        };

        var makeResizable = function() {
          var resizableConfig = {
            stop: updateCoordinatesStop,
            resize: updateCoordinates,
            grid: [scope.planting.cmInRow * scope.vm.zoom, scope.planting.cmBetweenRow * scope.vm.zoom],
            handles: 'all',
            containment: 'parent',
            autoHide: true,
            snap: false
          };
          element.resizable(resizableConfig);
        };

        scope.popoverEvent = function() {
          $timeout(function() {
            element.trigger('customEvent');
          }, 0);
        };

        element.on('click', function() {
          element.effect('highlight');
        });
        if (attrs['planting']==='future') {
            element.addClass('future-planting');
        } else {
          element.addClass('planting');  
        }

        scope.$on('updatedZoom', function() {
          // only new plantings can be repositioned
          if (typeof scope.planting._id === 'undefined') {
            $timeout(function() {
              makeDraggable();
              makeResizable();
            });
          }
        });

        // only new plantings can be repositioned
        if (typeof scope.planting._id === 'undefined') {
            scope.opacity = 1;
            element.addClass('newPlanting');
          /*element.effect('pulsate', function() {

          });*/
          makeResizable();
          makeDraggable();
        } else {
          scope.opacity = 0.5;
        }

        // Current plantings are NOT droppable (revert:'valid')
        if (attrs['planting'] !== 'future') {
            element.droppable();
        }

        scope.rotate = function() {
          var numberPlantsVertical;
          var numberPlantsHorizontal;
          if (scope.planting.orientation === 'vertical') {
            scope.planting.orientation = 'horizontal';
            scope.horizontal = Math.round(scope.planting.cmInRow);
            scope.vertical = Math.round(scope.planting.cmBetweenRow);
            element.resizable('option', 'grid', [scope.planting.cmInRow * scope.vm.zoom, scope.planting.cmBetweenRow * scope.vm.zoom]);

            numberPlantsVertical = Math.floor(scope.planting.elemheight / scope.planting.cmBetweenRow);
            if (numberPlantsVertical === 0) numberPlantsVertical = 1;
            numberPlantsHorizontal = Math.floor(scope.planting.elemwidth / scope.planting.cmBetweenRow);
            if (numberPlantsHorizontal === 0) numberPlantsHorizontal = 1;
            console.log('horizontal numberPlantsHorizontal: ' + numberPlantsHorizontal + ' scope.planting.elemwidth: ' + scope.planting.elemwidth + ' scope.planting.cmInRow: ' + scope.planting.cmInRow);
            console.log(' Number of plants vertical: ' + numberPlantsVertical);
            scope.planting.elemhwidth = numberPlantsHorizontal * scope.planting.cmInRow;
            scope.planting.elemhheight = numberPlantsVertical * scope.planting.cmBetweenRow;
          } else {
            scope.horizontal = Math.round(scope.planting.cmBetweenRow);
            scope.vertical = Math.round(scope.planting.cmInRow);
            scope.planting.orientation = 'vertical';
            element.resizable('option', 'grid', [scope.planting.cmBetweenRow * scope.vm.zoom, scope.planting.cmInRow * scope.vm.zoom]);
            // GOOD WAY
            numberPlantsVertical = Math.floor(scope.planting.elemheight / scope.planting.cmInRow);
            if (numberPlantsVertical === 0) numberPlantsVertical = 1;
            numberPlantsHorizontal = Math.floor(scope.planting.elemwidth / scope.planting.cmBetweenRow);
            if (numberPlantsHorizontal === 0) numberPlantsHorizontal = 1;
            console.log('vertical numberPlantsHorizontal: ' + numberPlantsHorizontal + ' plantingwidth: ' + scope.planting.elemwidth);
            console.log(' Number of plants vertical: ' + numberPlantsVertical);
            scope.planting.elemheight = numberPlantsVertical * scope.planting.cmInRow;
            scope.planting.elemwidth = numberPlantsHorizontal * scope.planting.cmBetweenRow;
            console.log(' plantingwidth: ' + element.css('width'));
          }
        };
      }
    };
  }
]);
