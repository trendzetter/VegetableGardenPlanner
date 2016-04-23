(function () {
  'use strict';

  angular
    .module('plantfamilies')
    .controller('PlantFamiliesController', PlantFamiliesController);

  PlantFamiliesController.$inject = ['$scope', '$state', '$window', 'plantFamilyResolve', 'Authentication'];

  function PlantFamiliesController($scope, $state, $window, plantfamily, Authentication) {
    var vm = this;

    vm.plantfamily = plantfamily;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.plantfamily.$remove($state.go('plantfamilies.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.plantFamilyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.plantfamily._id) {
        vm.plantfamily.$update(successCallback, errorCallback);
      } else {
        vm.plantfamily.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('plantfamilies.view', {
          plantFamilyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
