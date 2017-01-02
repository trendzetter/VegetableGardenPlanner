(function() {
  'use strict';

  angular
  .module('gardenparts')
  .controller('PlantingController', PlantingController);
  PlantingController.$inject = ['$scope', '$uibModal', '$uibModal', 'CultivationPlansService'];
  function PlantingController($scope, harvestModal, cultivationPlanModal, CultivationPlansService) {
    if ($scope.planting.orientation === 'vertical') {
      $scope.horizontal = Math.round($scope.planting.cmBetweenRow);
      $scope.vertical = Math.round($scope.planting.cmInRow);
    } else {
      $scope.horizontal = Math.round($scope.planting.cmInRow);
      $scope.vertical = Math.round($scope.planting.cmBetweenRow);
    }

    /*
    * the context menu
    */
    $scope.menuOptions = [];
    var cultivationPlan = ['Pas cultivationPlan toe', function() {
      var size = 'lg';
       /* var cps;
        if(typeof $scope.planting.plantVariety._id === 'undefined'){
          console.log('$scope.planting.plantVariety._id'+ $scope.planting.plantVariety._id);
          cps = CultivationPlansService.getByVariety({varietyId: $scope.planting.plantVariety._id});
        }else{
          cps = CultivationPlansService.getByVariety({varietyId: $scope.planting.plantVariety._id});
        }*/
      var cps = CultivationPlansService.getByVariety({ varietyId: $scope.planting.plantVariety._id });
      cps.$promise.then(function(cultivationPlans) {
          var planting = $scope.planting;
          planting.cultivationPlans = cultivationPlans;
          var modalInstance = cultivationPlanModal.open({
              templateUrl: '/modules/cultivation-plans/client/views/select-cultivation-plan.client.view.html',
              controller: 'SelectCultivationPlanController',
              size: size,
              resolve: {
              planting: function() {
                return planting;
              }
            }
            });

          modalInstance.result.then(function(planting) {
            delete planting.cultivationPlans;
            if (planting.currentPlan != planting.cultivationPlan && typeof planting._id !== 'undefined') {
              console.log('cultivationplan has changed!');
              $scope.changedPlans[planting._id] = planting.cultivationPlan;
            }
            if (planting.currentPlan != planting.cultivationPlan){
              planting.cultivationPlanStep = 0;
            }
          }, function() {
            console.log('Modal dismissed at: ' + new Date());
          });
        });
    }];
    /* For new plantings */
    if (typeof $scope.planting._id === 'undefined') {

      $scope.menuOptions.push(cultivationPlan);
      $scope.menuOptions.push(['Rotate', function() {
        $scope.rotate();
      }]);
      $scope.menuOptions.push(null); // Dividier
      $scope.menuOptions.push(['Cancel', function() {
        var planting = $scope.vm.gardenpart.plantings.splice($scope.$index, 1);
        $scope.cancelNewPlanting(planting);
      }]);
    } else {
      /* For existing plantings */
      if (!$scope.planting.future) {
        $scope.menuOptions.push(['Harvest', function() {
          var size = 'lg';
          var modalInstance = harvestModal.open({
            templateUrl: '/modules/harvests/client/views/create-harvest.client.view.html',
            controller: 'HarvestsController',
            size: size,
            resolve: {
              planting: function() {
                return $scope.planting;
              }
            }
          });

          modalInstance.result.then(function(harvest) {
            console.log('planting harvest result: ' + JSON.stringify(harvest));
          // if(result){
            $scope.harvests.push(harvest);
            $scope.vm.gardenpart.plantings.splice($scope.$index, 1);
          //  }
          }, function() {
            console.log('Modal dismissed at: ' + new Date());
          });
        }]);
      }

      $scope.menuOptions.push(cultivationPlan);

      $scope.menuOptions.push(['Cancel', function() {
        var planting;
        if ($scope.planting.future) {
          planting = $scope.vm.gardenpart.futureplantings.splice($scope.$index, 1);
        } else {
          planting = $scope.vm.gardenpart.plantings.splice($scope.$index, 1);
        }

        $scope.cancelPlanting(planting);
      }]);
    }


    $scope.updatePlantingCoordinates = function(top, left, width, height) {
      var planting = $scope.planting;
      planting.elemtop = top;
      planting.elemleft = left;
      planting.elemwidth = width;
      planting.elemheight = height;
    };

    $scope.updatePlantingCoordinatesStop = function(top, left, width, height) {
     /* var change = {};
      change.type = 'updateCoordinates';
      var planting = $scope.planting;
      change.planting = planting;
      change.data = {
        top: planting.elemtop,
        left: planting.elemleft,
        width: planting.elemwidth,
        height: planting.elemheight
      };*/
      $scope.updatePlantingCoordinates(top, left, width, height);
    };
  }
}());
