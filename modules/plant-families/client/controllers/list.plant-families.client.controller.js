(function () {
  'use strict';

  angular
    .module('plantfamilies')
    .controller('PlantFamiliesListController', PlantFamiliesListController);

  PlantFamiliesListController.$inject = ['PlantFamilyService'];

  function PlantFamiliesListController(PlantFamilyService) {
    var vm = this;

    vm.plantfamilies = PlantFamilyService.query();
  }
}());
