(function () {
  'use strict';

  angular
    .module('gardens')
    .controller('GardensController', GardensController);

  GardensController.$inject = ['$scope', '$state', 'Authentication'];

  function GardensController($scope, $state, Authentication) {
    var vm = this;

    vm.garden = $scope.garden;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Garden
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.garden.$remove($state.go('gardens.list'));
      }
    }

    // Save Garden
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.gardenForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.garden._id) {
        vm.garden.$update(successCallback, errorCallback);
      } else {
        vm.garden.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('gardens.view', {
          gardenId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
