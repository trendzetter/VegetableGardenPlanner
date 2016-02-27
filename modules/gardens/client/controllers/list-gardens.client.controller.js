(function () {
  'use strict';

  angular
    .module('gardens')
    .controller('GardensListController', GardensListController);

  GardensListController.$inject = ['GardensService','$stateParams'];

  function GardensListController(GardensService,$stateParams) {
    var vm = this;

    if($stateParams.plant){
      vm.gardendate = $stateParams.gardendate;
      vm.plant = $stateParams.plant;
    }else{
      var today = new Date();
      vm.gardendate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);
    }

    vm.gardens = GardensService.query();
  }
})();
