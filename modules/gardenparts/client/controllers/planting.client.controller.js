'use strict';

angular.module('gardenparts').controller('PlantingController', ['$scope','$uibModal',
	function($scope,$uibModal) {
        if($scope.planting.orientation === 'vertical'){
            $scope.horizontal = Math.round($scope.planting.cmBetweenRow);
            $scope.vertical = Math.round($scope.planting.cmInRow);
        }else{
            $scope.horizontal = Math.round($scope.planting.cmInRow);
            $scope.vertical = Math.round($scope.planting.cmBetweenRow);
        }

        $scope.menuOptions = [];
        /* For new plantings */
        if(typeof $scope.planting._id === 'undefined'){
            $scope.menuOptions.push(['Rotate', function () {
                $scope.rotate();
            }]);
            $scope.menuOptions.push(null);// Dividier
            $scope.menuOptions.push(['Cancel', function () {
                var planting = $scope.plantings.splice($scope.$index, 1);
                $scope.cancelNewPlanting(planting);
            }]);
        }else{
            /* For existing plantings */
            $scope.menuOptions.push(['Harvest', function () {
                var size = 'lg';
                var modalInstance = $uibModal.open({
                    templateUrl: 'modules/harvests/views/create-harvest.client.view.html',
                    controller: 'HarvestsController',
                    size: size,
                    resolve: {
                        planting: function () {
                            return $scope.planting;
                        }
                    }
                });

                modalInstance.result.then(function (harvest) {
                    console.log('planting harvest result: '+JSON.stringify(harvest));
                    //if(result){
                        $scope.harvests.push(harvest);
                        $scope.plantings.splice($scope.$index, 1);
                  //  }
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }]);
            $scope.menuOptions.push(['Cancel', function () {
                var planting = $scope.plantings.splice($scope.$index, 1);
                $scope.cancelPlanting(planting);
            }]);
        }


        $scope.updatePlantingCoordinates = function(top,left,width,height) {
            var planting = $scope.planting;
            planting.elemtop = top;
            planting.elemleft = left;
            planting.elemwidth = width;
            planting.elemheight = height;
        };

        $scope.updatePlantingCoordinatesStop = function(top,left,width,height) {
            var change = {};
            change.type = 'updateCoordinates';
            var planting = $scope.planting;
            change.planting = planting;
            change.data = { top: planting.elemtop,left: planting.elemleft,width: planting.elemwidth,height:planting.elemheight};
            $scope.updatePlantingCoordinates(top,left,width,height);
        };
	}
]);
