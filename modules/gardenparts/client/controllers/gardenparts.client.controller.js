(function() {
  'use strict';

  angular
    .module('gardenparts')
    .controller('GardenpartsController', GardenpartsController);

  GardenpartsController.$inject = ['$scope', '$state', '$stateParams', 'gardenpartResolve', 'Authentication', 'GardenpartService', 'Plantvarieties', 'Plantings', 'PastPlantings'];

  function GardenpartsController($scope, $state, $stateParams, gardenpart, Authentication, Gardenpart, Plantvarieties, Plantings, PastPlantings) {

    var vm = this;

    vm.gardenpart = gardenpart;

    getPlantvarieties();

    $scope.authentication = Authentication;
    vm.selectedDate = $stateParams.selectedDate;
    $scope.plantings = [];
    $scope.newplantings = [];
    $scope.cancelPlantings = [];
    $scope.harvests = [];
    $scope.changedPlans = {};
    // $scope.changes = [];
    vm.crops = [];

    $scope.cropClicked = function(crop) {
      $scope.rotationAdvice(crop);
    };

    // Add the pastplantings
    var pp = gardenpart.pastplantings;
    for (var j = 0; j < pp.length; j++) {
      var planting = pp[j];
      planting.elemtop = parseInt(planting.elemtop) - gardenpart.elemtop;
      planting.elemleft = parseInt(planting.elemleft) - gardenpart.elemleft;
      // assign a cropgroup to the past plantings
      planting.cropgroup = cropgroupByCrop(planting.plantVariety.crop);
    }

    function cropgroupByCrop(crop) {
      var cropgroup = false;
      loop:
        for (var c = 0; c < gardenpart.ruleset.cropgroups.length; c++) {
          var crops = gardenpart.ruleset.cropgroups[c].crops;
          for (var d = 0; d < crops.length; d++) {
            if (crops[d] === crop) {
              cropgroup = gardenpart.ruleset.cropgroups[c]._id;
              break loop;
            }
          }
        }
      return cropgroup;
    }

    $scope.rotationAdvice = function(crop) {
      console.log('calculating the advice! crop:' + crop);
      var cropgroup = cropgroupByCrop(crop);
      console.log('calculating the advice! cropgroup:' + cropgroup);
      for (var i = 0; i < gardenpart.pastplantings.length; i++) {
        var planting = gardenpart.pastplantings[i];
        planting.greenlevel = null;
        planting.redlevel = null;
        var yearsApart = new Date(new Date(vm.selectedDate) - new Date(planting.validTo)).getFullYear() - 1970;
        console.log('years apart: ' + yearsApart + ' date:' + planting.validTo);
        // opacity inverse linked to time past since planting
        planting.opacity = 1 - (yearsApart * yearsApart / 36);

        if (yearsApart < 2 && cropgroup === planting.cropgroup) {
          planting.greenlevel = 0;
          planting.redlevel = 255;
          continue;
        }

        for (var k = 0; k < gardenpart.ruleset.rotationrules.length; k++) {
          console.log('cropgroup' + cropgroup +
            'rotationrules[k].cropgroup' + gardenpart.ruleset.rotationrules[k].cropgroup);
          console.log('previousCropgroup:' + gardenpart.ruleset.rotationrules[k].previousCropgroup + ' planting.cropgroup: ' + planting.cropgroup);
          if (cropgroup === gardenpart.ruleset.rotationrules[k].cropgroup && gardenpart.ruleset.rotationrules[k].previousCropgroup === planting.cropgroup) {
            console.log('rule applies, checking time');
            if (gardenpart.ruleset.rotationrules[k].yearsBetween > yearsApart) {
              planting.greenlevel = 0;
              planting.redlevel = 255;
            } else {
              planting.greenlevel = 255;
              planting.redlevel = 0;
            }
          }
        }
      }

    };

    $scope.updatePlantings = function() {
      var i;
      for (i = 0; i < $scope.harvests.length; i++) {
        $scope.harvests[i].$save();
      }
      // convert position to absolute for all plantings and put the id in place of the plantvariety
      var plantings = $scope.newplantings;

      for (i = 0; i < plantings.length; i++) {
        plantings[i].elemtop = parseInt(plantings[i].elemtop) + parseInt(vm.gardenpart.elemtop);
        plantings[i].elemleft = parseInt(plantings[i].elemleft) + parseInt(vm.gardenpart.elemleft);
        plantings[i].plantVariety = plantings[i].plantVariety._id;
      }

      var updateplantings = {
        newplantings: plantings,
        cancelplantings: $scope.cancelPlantings,
        changedPlans: $scope.changedPlans
      };
      Plantings.updatePlantings({
        bk: vm.gardenpart.garden.bk,
        selectedDate: $stateParams.selectedDate
      }, updateplantings, function() {
        $state.go('viewGarden', {
          bk: vm.gardenpart.garden.bk,
          selectedDate: $stateParams.selectedDate
        });
      });

    };

    $scope.$on('addPlantvariety', function(event, plantvariety) {
      var newplanting = {
        garden: gardenpart.garden.bk,
        validFrom: $stateParams.selectedDate,
        plantVariety: plantvariety,
        elemwidth: plantvariety.cmInRow * 2,
        elemheight: plantvariety.cmBetweenRow * 2,
        elemtop: 0,
        elemleft: 0,
        orientation: 'horizontal',
        cmBetweenRow: plantvariety.cmBetweenRow,
        cmInRow: plantvariety.cmInRow
      };
      $scope.newplantings.push(newplanting);
      vm.gardenpart.plantings.push(newplanting);
      console.log('plantvariety clicked! ' + plantvariety.name);
    });

    $scope.cancelNewPlanting = function(planting) {
      var index = $scope.newplantings.indexOf(planting);
      $scope.newplantings.splice(index, 1);
    };

    $scope.cancelPlanting = function(planting) {
      $scope.cancelPlantings.push(planting[0]._id);
    };

    function getPlantvarieties() {
      var datearray = $stateParams.selectedDate.split('-');
      var now = new Date();
      now.setYear(datearray[0]);
      var month = datearray[1] - 1;
      now.setMonth(month);
      now.setDate(datearray[2]);
      var start = new Date(now.getFullYear(), 0, 0);
      var diff = now - start;
      var oneDay = 1000 * 60 * 60 * 24;
      var day = Math.floor(diff / oneDay);
      vm.plantvarieties = Plantvarieties.get({
        'doy': day
      });
      vm.plantvarieties.$promise.then(function(plantvarieties) {
        if (vm.gardenpart.plant !== undefined) {
          plantvarieties.unshift(vm.gardenpart.plant);
          var index = 1;
          while (index < plantvarieties.length && plantvarieties[index]._id !== vm.gardenpart.plant._id) {
            index++;
          }
          plantvarieties.splice(index, 1);
        }

        for (var i = 0; i < plantvarieties.length; i++) {
          var plant = plantvarieties[i];

          var newCrop = true;
          var j = 0;
          while (newCrop === true && j < vm.crops.length) {
            var crop = vm.crops[j];
            if (crop._id === plant.crop._id) {
              plant.crop = plant.crop._id; // Avoid recursion
              newCrop = false;
              crop.plantvarieties.push(plant);
            }
            j++;
          }
          if (newCrop) {
            var addcrop = plant.crop;
            plant.crop = plant.crop._id; // Avoid recursion
            addcrop.plantvarieties = [];
            addcrop.plantvarieties.push(plant);
            vm.crops.push(addcrop);
          }
        }

        $scope.rotationAdvice(vm.crops[0]._id);
        $scope.$broadcast('plantingsLoaded');
      });
    }
  }
}());
