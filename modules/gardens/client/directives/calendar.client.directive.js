'use strict';
/* global $:false */
angular.module('gardens').directive('calendar', ['$state', '$stateParams',
  function($state, $stateParams) {
    return {
      require: 'ngModel',
      link: function(scope, el, attr, ngModel) {
        el.datepicker({
          changeMonth: true,
          changeYear: true,
          dateFormat: 'yy-mm-dd',
          onSelect: function(dateText) {
            scope.$apply(function() {
              ngModel.$setViewValue(dateText);
              scope.setDate(dateText);
              var mode = attr.calendar;

              if ($state.current.name === 'plantGarden') {
                console.log('calendar $state.current.name :' + $state.current.name);
                $state.go('plantGarden', {
                  bk: scope.vm.garden.bk,
                  selectedDate: dateText,
                  plant: $stateParams.plant
                });
                return;
              }

              // In view reload met tuin op die datum
              if (mode === 'view' || mode === 'edit') {
                $state.go('viewGarden', {
                  bk: scope.vm.garden.bk,
                  selectedDate: dateText
                });
              }
            });
          }
        });
      }
    };
  }
]);
