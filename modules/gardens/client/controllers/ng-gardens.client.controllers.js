(function () {
  'use strict';

  angular
    .module('gardens')
    .controller('GardensNgController', GardensNgController);

  GardensNgController.$inject = ['$scope', '$state', 'gardenResolve', 'Authentication'];

  function GardensNgController($scope, $state, garden, Authentication) {
    var vm = this;

    vm.garden = garden;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.setDate = function(date) {
      $scope.vm.selectedDate = date;
    };

    // During create > resize
    $scope.updateCoordinates = function(top, left, height, width) {
      vm.garden.elemtop = top;
      vm.garden.elemleft = left;
      vm.garden.elemwidth = width;
      vm.garden.elemheight = height;
      var opp = Math.round(height * width / 10000);
      $scope.tooltiptext = 'breedte: ' + height + ' cm lengte: ' + width + ' cm ' + 'oppervlakte: ' + opp + ' m² ± ' + Math.round(height * width / 150000) + ' personen';
    };


    // Remove existing garden
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.garden.$remove($state.go('gardens.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.garden._id) {
        vm.garden.$update(successCallback, errorCallback);
      } else {
        vm.garden.validFrom = new Date(0);
        vm.garden.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('designGarden', {
          gardenId: res._id,
          selectedDate: vm.selectedDate
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
