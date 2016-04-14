(function () {
  'use strict';

  angular
    .module('cultivation-plans')
    .controller('CultivationPlansListController', CultivationPlansListController);

  CultivationPlansListController.$inject = ['CultivationPlansService'];

  function CultivationPlansListController(CultivationPlansService) {
    var vm = this;

    vm.cultivationPlans = CultivationPlansService.query();
  }
}());
