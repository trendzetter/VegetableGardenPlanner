'use strict';

//Gardenversions service used to communicate Gardenversions REST endpoints
angular.module('gardens').factory('Gardenversions', ['$resource','$stateParams',
	function($resource, $stateParams) {
        if($stateParams.selectedDate === undefined){
            var today = new Date();
            $stateParams.selectedDate = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
        }
        console.log('gardenversions service statedate: ' + $stateParams.selectedDate);
		return $resource('/api/gardenversions/:gardenId/:selectedDate', { gardenId: '@_id',selectedDate: '@selectedDate'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
