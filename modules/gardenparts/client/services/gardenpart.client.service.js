'use strict';

//Gardens service used to communicate Gardens REST endpoints
angular.module('gardenparts').factory('Gardenpart', ['$resource',
function($resource) {
  return $resource('gardenparts/:bk/:selectedDate', { selectedDate: '@selectedDate', bk: '@bk' //gardenId: '@_id',
}, {
  createParts: {
    method: 'PUT',
    isArray : true
  },
  updateParts: {
    method: 'POST',
    isArray : true
  },
  deleteParts: {
    method: 'POST',
    url: '/gardenparts/delete/:bk/:selectedDate',
    isArray: true
  }
});
}
]);
