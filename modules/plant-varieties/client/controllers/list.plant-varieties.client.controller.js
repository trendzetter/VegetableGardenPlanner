(function () {
  'use strict';

  angular
    .module('plant-varieties')
    .controller('PlantVarietiesListController', PlantVarietiesListController);

  PlantVarietiesListController.$inject = ['PlantVarietiesService'];

  function PlantVarietiesListController(PlantVarietiesService) {
    var vm = this;

    vm.plantvarieties = PlantVarietiesService.query();
  }
}());
