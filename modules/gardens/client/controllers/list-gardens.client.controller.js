(function () {
  'use strict';

  angular
    .module('gardens')
    .controller('GardensListController', GardensListController);

  GardensListController.$inject = ['GardensService'];

  function GardensListController(GardensService) {
    var vm = this;

    var today = new Date();
    vm.date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);

    vm.gardens = GardensService.query();
  }
})();
