(function () {
  'use strict';

  angular
    .module('crops')
    .controller('CropsListController', CropsListController);

  CropsListController.$inject = ['CropsService'];

  function CropsListController(CropsService) {
    var vm = this;

    vm.crops = CropsService.query();
  }
})();
