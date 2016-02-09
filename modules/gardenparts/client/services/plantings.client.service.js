'use strict';

angular.module('gardenparts').factory('Plantings', ['$resource',
    function($resource) {
        return $resource('plantings/:bk/:selectedDate', { selectedDate: '@selectedDate', bk: '@bk' //gardenId: '@_id',
        }, {
            createPlantings: {
                method: 'PUT',
                isArray : true
            },
            cancelPlantings: {
                method: 'POST',
                isArray : true
            }
          /*  updatePlantings: {
                method: 'POST',
                isArray : true
            }*/
        });
    }
]);