(function () {
  'use strict';

  angular
    .module('cultivation-plans')
    .controller('SelectCultivationPlanController', SelectCultivationPlanController);

  SelectCultivationPlanController.$inject = ['$scope', 'cultivationPlans', '$uibModalInstance', '$state'];

  function SelectCultivationPlanController($scope,cultivationPlans,$uibModalInstance, $state) {
    var vm = this;
    $scope.cultivationPlans = cultivationPlans;
    
    $scope.createNew = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go('cultivation-plans.create');
    };
  }
}());