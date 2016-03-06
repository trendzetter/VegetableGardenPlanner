'use strict';
/*global $:false */
angular.module('gardens').directive('calendar', ['$state',
  function($state) {
    return {
      require: 'ngModel',
      link: function(scope, el, attr, ngModel) {
        el.datepicker({
          dateFormat: 'yy-mm-dd',
          onSelect: function(dateText) {
            scope.$apply(function() {
              ngModel.$setViewValue(dateText);
              scope.setDate(dateText);
              var mode = attr.calendar;

              //In view reload met tuin op die datum
              if (mode === 'view' || mode === 'edit') {
                //scope.findOne();
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
