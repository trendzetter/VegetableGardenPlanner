(function() {
  'use strict';

  angular
    .module('crops')
    .controller('CropsController', CropsController);

  CropsController.$inject = ['$scope', '$state', '$window', 'cropResolve', 'Authentication', 'PlantFamilyService','PlantVarietiesService'];

  function CropsController($scope, $state, $window, crop, Authentication, PlantFamilyService,PlantVarietiesService) {
    var vm = this;

    vm.crop = crop;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // adding the list of plantfamilies
    //  if($state.current.name === 'crops.edit'){
    if ($state.current.name !== 'crops.view') {
      vm.plantfamilies = PlantFamilyService.query();
    }else{
      vm.varieties = PlantVarietiesService.getCrop({cropId:vm.crop._id});
    }

    // Remove existing Crop
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.crop.$remove($state.go('crops.list'));
      }
    }

    // Save Crop
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cropForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.crop._id) {
        vm.crop.$update(successCallback, errorCallback);
      } else {
        vm.crop.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('crops.view', {
          cropId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
