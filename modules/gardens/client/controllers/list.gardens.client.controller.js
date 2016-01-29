(function () {
  'use strict';

  angular
    .module('gardens')
    .controller('GardensListController', GardensListController);

  GardensListController.$inject = ['GardensService'];

  function GardensListController(GardensService) {
    var vm = this;

    vm.gardens = GardensService.query();
  }
})();
