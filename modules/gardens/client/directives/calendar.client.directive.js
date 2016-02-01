'use strict';
/*global $:false */
angular.module('gardens').directive('calendar', [
	function() {
        return {
            require: 'ngModel',
            link: function (scope, el, attr, ngModel) {
							console.log('calendar ');
                el.datepicker({
                    dateFormat: 'yy-mm-dd',
                    onSelect: function (dateText) {
                        //console.log('attr: '+ JSON.stringify(attr));
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                            scope.setDate(dateText);

                            console.log('attr: '+ attr.calendar);
                            var mode = attr.calendar;

                            //In view reload met tuin op die datum
                            if( mode === 'view' || mode === 'edit' ) {
                                scope.findOne();
                            }
                        });
                    }
                });
            }
        };
	}
]);
