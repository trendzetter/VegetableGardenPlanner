(function () {
  'use strict';

  angular
    .module('cultivation-plans')
    .controller('SelectCultivationPlanController', SelectCultivationPlanController);

  SelectCultivationPlanController.$inject = ['CultivationPlansService','planting'];

  function SelectCultivationPlanController(CultivationPlansService,planting) {
    var vm = this;

    planting.cultivationPlans = CultivationPlansService.query(); //{ crop: planting.plantvariety.crop }
  }
}());