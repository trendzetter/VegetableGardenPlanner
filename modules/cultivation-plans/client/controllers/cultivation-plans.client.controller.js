(function () {
  'use strict';

  angular
    .module('cultivation-plans')
    .controller('CultivationPlansController', CultivationPlansController);

  CultivationPlansController.$inject = ['$scope', '$state', 'cultivationPlanResolve', '$window', 'Authentication','CropsService'];

  function CultivationPlansController($scope, $state, cultivationPlan, $window, Authentication,Crops) {
    var vm = this;

    vm.cultivationPlan = cultivationPlan;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.crops = Crops.query();
    
    vm.crops.$promise.then(function(crops) {
      if (!cultivationPlan._id) {
        console.log('new cultivationPlan');
        vm.cultivationPlan.steps = [];
        newStep();
      }
    });
    
    function newStep() {
      var step = {};
      vm.cultivationPlan.steps.push(step);
    }

    vm.newStep = newStep;
    
    function removeStep(index) {
      console.log('remove step:' + index);
      vm.cultivationPlan.steps.splice(index, 1);
    }
    
    vm.removeStep = removeStep;

    // Remove existing CultivationPlan
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.cultivationPlan.$remove($state.go('cultivation-plans.list'));
      }
    }

    // Save CultivationPlan
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cultivationPlanForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.cultivationPlan._id) {
        vm.cultivationPlan.$update(successCallback, errorCallback);
      } else {
        vm.cultivationPlan.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('cultivation-plans.view', {
          cultivationPlanId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
