(function () {
  'use strict';

  angular
    .module('plant-varieties')
    .controller('PlantVarietiesListController', PlantVarietiesListController);

  PlantVarietiesListController.$inject = ['$filter','PlantVarietiesService'];

  function PlantVarietiesListController($filter,PlantVarietiesService) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    PlantVarietiesService.query(function (data) {
      vm.plantvarieties = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.plantvarieties, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }     

  }
}());
