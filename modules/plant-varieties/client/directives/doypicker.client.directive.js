'use strict';
/*global $:false */
angular.module('plant-varieties').directive('doypicker', [
    function() {
        return {
            require: 'ngModel',
            link: function (scope, el, attr, ngModel) {
                $(el).datepicker({
                    dateFormat: 'o'
                });
            }
        };
    }]);