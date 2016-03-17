(function () {
  'use strict';

  angular
    .module('gardens')
    .controller('PlantGardenController', PlantGardenController);

  PlantGardenController.$inject = ['$scope', '$state', 'gardenResolve', 'Authentication','$stateParams','GardenpartsService','RuleSetsService'];

  function PlantGardenController($scope, $state, garden, Authentication,$stateParams,GardenpartsService,RuleSetsService) {

    var vm = this;

    vm.garden = garden;
    vm.authentication = Authentication;
    vm.selectedDate = $stateParams.selectedDate;
    vm.error = null;
    vm.form = {};

    $scope.setDate = function(date) {
      vm.selectedDate = date;
    };

    //For use in plantGarden below (plantadvice)
    function cropgroupByCrop(crop) {
      var cropgroup = false;
      loop:
        for (var c = 0; c < garden.ruleset.cropgroups.length; c++) {
          var crops = garden.ruleset.cropgroups[c].crops;
          for (var d = 0; d < crops.length; d++) {
            if (crops[d]._id === crop) {
              cropgroup = garden.ruleset.cropgroups[c]._id;
              break loop;
            }
          }
        }
      return cropgroup;
    }


    function successCallback(res) {
        var crop = garden.plantVariety.crop;
        var cropgroup = cropgroupByCrop(crop);
        console.log('calculating the advice! crop: '+ crop + ' cropgroup: ' + cropgroup);
        //Add the pastplantings
        var pp = garden.pastplantings;
        for (var j = 0; j < pp.length; j++) {
          var planting = pp[j];
          planting.elemtop = parseInt(planting.elemtop) - vm.garden.elemtop;
          planting.elemleft = parseInt(planting.elemleft) - vm.garden.elemleft;
          //assign a cropgroup to the past plantings
          planting.cropgroup = cropgroupByCrop(planting.plantVariety.crop);

          planting.greenlevel = null;
          planting.redlevel = null;
          var yearsApart = new Date(new Date(vm.selectedDate) - new Date(planting.validTo)).getFullYear() - 1970;
          console.log('years apart: ' + yearsApart + ' date:' + planting.validTo);
          //opacity inverse linked to time past since planting
          planting.opacity = 1 - (yearsApart * yearsApart / 36);

          if (yearsApart < 2 && cropgroup === planting.cropgroup) {
            planting.greenlevel = 0;
            planting.redlevel = 255;
            continue;
          }
          var rotationrules = vm.garden.ruleset.rotationrules;
          for (var k = 0; k < rotationrules.length; k++) {
            console.log('cropgroup' + cropgroup +
              'rotationrules[k].cropgroup' +rotationrules[k].cropgroup);
            console.log('previousCropgroup:' +rotationrules[k].previousCropgroup + ' planting.cropgroup: ' + planting.cropgroup);
            if (cropgroup === rotationrules[k].cropgroup && rotationrules[k].previousCropgroup === planting.cropgroup) {
              console.log('rule applies, checking time');
              if (rotationrules[k].yearsBetween > yearsApart) {
                planting.greenlevel = 0;
                planting.redlevel = 255;
              } else {
                planting.greenlevel = 255;
                planting.redlevel = 0;
              }
            }
          }
        }
    }

    function errorCallback(res) {
      vm.error = res.data.message;
    }

    vm.garden.ruleset = RuleSetsService.get({'ruleSetId': garden.ruleset},successCallback,errorCallback);

  }
})();
