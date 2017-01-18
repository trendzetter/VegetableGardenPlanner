(function() {
  'use strict';

  angular
    .module('plant-varieties')
    .controller('ViewVarietyController', ViewVarietyController);

  ViewVarietyController.$inject = ['Authentication', 'CropsService', 'plantVarietyResolve'];

  function ViewVarietyController(Authentication, CropsService, plantvariety) {
    var vm = this;
    vm.plantvariety = plantvariety;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    var year = new Date().getFullYear();
    var dateStart = new Date(year, 0);
    vm.DOYstartSow = new Date(dateStart.setDate(plantvariety.DOYstartSow));
    var dateEnd = new Date(year, 0);
    vm.DOYendSow = new Date(dateEnd.setDate(plantvariety.DOYendSow));
    var today = new Date();
    if (vm.DOYendSow < today) {
        console.log('Zaaien is al voorbij vm.DOYendSow: ' + vm.DOYendSow + '< today: ' + today);
        vm.selectedDate = vm.DOYstartSow.getFullYear() + 1 + '-' + ('0' + (vm.DOYstartSow.getMonth() + 1)).substr(-2) + '-' + ('0' + vm.DOYstartSow.getDate()).substr(-2);
    } else {
        if (vm.DOYstartSow < today) {
            console.log('Zaaien is al begonnen neem vandaag');
            vm.selectedDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);
        } else {
            console.log(' vm.DOYendSow: ' + vm.DOYendSow + '>= today: ' + today);
            console.log(' vm.DOYstartSow: ' + vm.DOYstartSow + '>= today: ' + today);
            console.log('Zaaien is al nog niet begonnen neem dit jaar zaaiperiode start');
            vm.selectedDate = vm.DOYstartSow.getFullYear() + '-' + ('0' + (vm.DOYstartSow.getMonth() + 1)).substr(-2) + '-' + ('0' + vm.DOYstartSow.getDate()).substr(-2);
        }
    }
    // Remove existing PlantVariety
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.plantvariety.$remove($state.go('plant-varieties.list'));
      }
    }

  }
}());
