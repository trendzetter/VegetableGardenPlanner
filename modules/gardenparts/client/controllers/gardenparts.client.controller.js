'use strict';

// Gardenparts controller
angular.module('gardenparts').controller('GardenpartsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'GardensService', 'GardenpartService', 'Plantvarieties', 'Plantings', 'PastPlantings', 'RuleSetsService',
  function($scope, $state, $stateParams, $location, Authentication, Gardens, Gardenpart, Plantvarieties, Plantings, PastPlantings, RuleSets) {
    $scope.authentication = Authentication;
    $scope.date = $stateParams.selectedDate;
    $scope.plantings = [];
    $scope.newplantings = [];
    $scope.cancelPlantings = [];
    $scope.harvests = [];
    $scope.changes = [];
    $scope.crops = [];

    $scope.cropClicked = function(crop) {
      console.log('crop: ' + JSON.stringify(crop));
      $scope.rotationAdvice(crop);
    };

    function cropgroupByCrop(crop) {
      var cropgroup = false;
      loop:
        for (var c = 0; c < $scope.ruleSet.cropgroups.length; c++) {
          var crops = $scope.ruleSet.cropgroups[c].crops;
          for (var d = 0; d < crops.length; d++) {
            if (crops[d]._id === crop) {
              cropgroup = $scope.ruleSet.cropgroups[c]._id;
              break loop;
            }
          }
        }
      return cropgroup;
    }

    $scope.rotationAdvice = function(crop) {
      console.log('calculating the advice! crop:'+ crop);
      var cropgroup = cropgroupByCrop(crop);
      console.log('calculating the advice! cropgroup:' + cropgroup);
      for (var i = 0; i < $scope.pastplantings.length; i++) {
        var planting = $scope.pastplantings[i];
        planting.greenlevel = null;
        planting.redlevel = null;
        var yearsApart = new Date(new Date($scope.date) - new Date(planting.validTo)).getFullYear() - 1970;
        console.log('years apart: ' + yearsApart + ' date:' + planting.validTo);
        //opacity inverse linked to time past since planting
        planting.opacity = 1 - (yearsApart * yearsApart / 36);

        if (yearsApart < 2 && cropgroup === planting.cropgroup) {
          planting.greenlevel = 0;
          planting.redlevel = 255;
          continue;
        }

        for (var k = 0; k < $scope.ruleSet.rotationrules.length; k++) {
          console.log('cropgroup' + cropgroup +
            'rotationrules[k].cropgroup' + $scope.ruleSet.rotationrules[k].cropgroup);
          console.log('previousCropgroup:' + $scope.ruleSet.rotationrules[k].previousCropgroup + ' planting.cropgroup: ' + planting.cropgroup);
          if (cropgroup === $scope.ruleSet.rotationrules[k].cropgroup && $scope.ruleSet.rotationrules[k].previousCropgroup === planting.cropgroup) {
            console.log('rule applies, checking time');
            if ($scope.ruleSet.rotationrules[k].yearsBetween > yearsApart) {
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
      var gardenpart = $scope.gardenpart;

      //convert position to absolute for all plantings and put the id in place of the plantvariety
      var plantings = $scope.plantings;
      for (var i = 0; i < plantings.length; i++) {
        plantings[i].elemtop = parseInt(plantings[i].elemtop) + parseInt(gardenpart.elemtop);
        plantings[i].elemleft = parseInt(plantings[i].elemleft) + parseInt(gardenpart.elemleft);
        plantings[i].plantVariety = plantings[i].plantVariety._id;
      }
      for (i = 0; i < $scope.harvests.length; i++) {
        $scope.harvests[i].$save();
      }
      Plantings.createPlantings({
        bk: gardenpart.garden,
        selectedDate: $stateParams.selectedDate
      }, $scope.newplantings, function(){
        var cancelPlantings = Plantings.cancelPlantings({
          bk: gardenpart.garden,
          selectedDate: $stateParams.selectedDate
        }, $scope.cancelPlantings,function(){
          console.log("cancelPlantings success");
        });
        cancelPlantings.$promise.then(function(){
          $state.go('viewGarden', {
            bk: $scope.gardenpart.garden,
            selectedDate: $stateParams.selectedDate
          });
        });
      });

      $location.path('gardens/' + gardenpart.garden + '/' + $stateParams.selectedDate);
    };

    $scope.$on('addPlantvariety', function(event, plantvariety) {
      var newplanting = {
        garden: $scope.gardenpart.garden,
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
      $scope.plantings.push(newplanting);
      console.log('plantvariety clicked! ' + plantvariety.name);
    });

    $scope.cancelNewPlanting = function(planting) {
      var index = $scope.newplantings.indexOf(planting);
      $scope.newplantings.splice(index, 1);
    };

    $scope.cancelPlanting = function(planting) {
      $scope.cancelPlantings.push(planting[0]._id);
    };

    $scope.getPlantvarieties = function() {
      console.log('$stateParams.selectedDate' + $stateParams.selectedDate);
      var datearray = $stateParams.selectedDate.split('-');
      console.log('datearray: ' + datearray);
      var now = new Date();
      now.setYear(datearray[0]);
      console.log('year: ' + datearray[0]);
      var month = datearray[1] - 1;
      now.setMonth(month);
      console.log('month: ' + month);
      now.setDate(datearray[2]);
      console.log('dag: ' + datearray[2]);
      var start = new Date(now.getFullYear(), 0, 0);
      console.log('start: ' + start);
      console.log('now: ' + now);
      var diff = now - start;
      var oneDay = 1000 * 60 * 60 * 24;
      var day = Math.floor(diff / oneDay);
      console.log('doy: ' + day);
      $scope.plantvarieties = Plantvarieties.get({
        'doy': day
      });
      $scope.plantvarieties.$promise.then(function(plantvarieties) {
        if($scope.gardenpart.plant !== undefined){
          plantvarieties.unshift($scope.gardenpart.plant);
          var index =1;
          while(index<plantvarieties.length && plantvarieties[index]._id !== $scope.gardenpart.plant._id){
            index++;
          }
          plantvarieties.splice(index,1);
        }

        for (var i = 0; i < plantvarieties.length; i++) {
          var plant = plantvarieties[i];

          var newCrop = true;
          var j = 0;
          while (newCrop === true && j < $scope.crops.length) {
            var crop = $scope.crops[j];
            if (crop._id === plant.crop._id) {
              plant.crop = plant.crop._id; //Avoid recursion
              newCrop = false;
              crop.plantvarieties.push(plant);
            }
            j++;
          }
          if (newCrop) {
            var addcrop = plant.crop;
            plant.crop = plant.crop._id; //Avoid recursion
            addcrop.plantvarieties = [];
            addcrop.plantvarieties.push(plant);
            $scope.crops.push(addcrop);
          }
        }
      });
    };

    // Find existing Gardenpart
    $scope.findOne = function() {
      console.log('stateparams.plant: '+$stateParams.plant);
      $scope.gardenpart = Gardenpart.get({
        bk: $stateParams.bk,
        selectedDate: $stateParams.selectedDate,
        plant: $stateParams.plant
      });
      // promise then gardenpart.gardenbk
      $scope.gardenpart.$promise.then(function(gardenpart) {
        $scope.getPlantvarieties();
        //TODO: check if the whole gardenobject is required
        $scope.garden = Gardens.get({
          bk: gardenpart.garden,
          selectedDate: $stateParams.selectedDate
        }, function(garden){
          //Add the plantings
          var plantings = gardenpart.plantings;
          var gardenparttop = parseInt(gardenpart.elemtop);
          var gardenpartleft = parseInt(gardenpart.elemleft);
          for (var i = 0; i < plantings.length; i++) {
            plantings[i].elemtop = parseInt(plantings[i].elemtop) - gardenparttop;
            plantings[i].elemleft = parseInt(plantings[i].elemleft) - gardenpartleft;
          }
          $scope.plantings = gardenpart.plantings;

          $scope.ruleSet = RuleSets.get({
            'ruleSetId': garden.ruleset
          });

          $scope.ruleSet.$promise.then(function(ruleSet) {
            $scope.pastplantings = PastPlantings.get({
              bk: $stateParams.bk,
              selectedDate: $stateParams.selectedDate
            });
            $scope.pastplantings.$promise.then(function(pastp) {
              //Add the pastplantings
              var pp = $scope.pastplantings;
              for (var j = 0; j < pp.length; j++) {
                var planting = pp[j];
                planting.elemtop = parseInt(planting.elemtop) - gardenparttop;
                planting.elemleft = parseInt(planting.elemleft) - gardenpartleft;
                //assign a cropgroup to the past plantings
                planting.cropgroup = cropgroupByCrop(planting.plantVariety.crop);
              }
              $scope.rotationAdvice($scope.crops[0]._id);
              $scope.$emit('plantingsLoaded');
            });
          });
        });
      });
    };
  }
]);
