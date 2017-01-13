(function () {
  'use strict';

  angular
    .module('cultivation-plans')
    .controller('SelectCultivationPlanController', SelectCultivationPlanController);

  SelectCultivationPlanController.$inject = ['$scope', 'planting', '$uibModalInstance', '$state'];

  function SelectCultivationPlanController($scope, planting, $uibModalInstance, $state) {
    console.log('planting: ' + planting.cultivationPlans);
    var vm = this;
    $scope.vm = vm;
    $scope.cultivationPlans = planting.cultivationPlans;
    $scope.planting = planting;
    planting.currentPlan = planting.cultivationPlan;

    $scope.applyCultivationPlan = function() {
      $uibModalInstance.close(planting);
    };

    $scope.createNew = function () {
      $uibModalInstance.dismiss('cancel');
      $state.go('cultivation-plans.create');
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
