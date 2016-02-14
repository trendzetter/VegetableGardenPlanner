'use strict';

// Gardenparts controller
angular.module('gardenparts').controller('GardenpartsController', ['$scope', '$stateParams', '$location', 'Authentication', 'GardensService', 'GardenpartService', 'Plantvarieties','Plantings','PastPlantings','RuleSetsService',
	function($scope, $stateParams, $location, Authentication, Gardens, Gardenpart, Plantvarieties,Plantings,PastPlantings,RuleSets) {
		$scope.authentication = Authentication;
				$scope.date = $stateParams.selectedDate;
        $scope.plantings = [];
        $scope.newplantings = [];
        $scope.cancelPlantings = [];
        $scope.harvests = [];
        $scope.changes = [];
				$scope.crops = [];

				$scope.cropClicked = function(crop){
					console.log('crop: '+JSON.stringify(crop));
					$scope.rotationAdvice(crop);
				}

				$scope.expandCallback = function (index, id) {
					console.log('crop: '+$scope.crops[index]._id);
					$scope.rotationAdvice($scope.crops[index]._id);
				};

				$scope.rotationAdvice = function(crop){
					console.log("calculating the advice!");
					var cropgroup=false;
					for(var c=0;c<$scope.ruleSet.cropgroups.length;c++){
						if($scope.ruleSet.cropgroups[c].crops.indexOf(crop)!==-1){
							cropgroup = $scope.ruleSet.cropgroups[c]._id;
							break;
						}
					}
					for(var i = 0;i<$scope.pastplantings.length;i++){
						var planting = $scope.pastplantings[i];
						planting.greenlevel = null; planting.redlevel = null;
						var yearsApart = new Date(new Date($scope.date) - new Date(planting.validTo)).getFullYear()-1970;
						console.log('years apart: '+yearsApart+' date:'+planting.validTo);
						//opacity inverse linked to time past since planting
						planting.opacity = 1-(yearsApart*yearsApart/36);

						if(yearsApart < 2  && cropgroup ===planting.cropgroup){
							planting.greenlevel = 0; planting.redlevel = 255;
							continue;
						}

						for(var k=0;k<$scope.ruleSet.rotationrules.length;k++){
							console.log('cropgroup'+cropgroup +
							 '$scope.ruleSet.rotationrules[k].cropgroup'+$scope.ruleSet.rotationrules[k].cropgroup);

							if(cropgroup===$scope.ruleSet.rotationrules[k].cropgroup&&$scope.ruleSet.rotationrules[k].previousCropgroup === planting.cropgroup){
								if($scope.ruleSet.rotationrules[k].yearsBetween>yearsApart){
									planting.greenlevel = 0; planting.redlevel = 255;
								}else{
									planting.greenlevel = 255; planting.redlevel = 0;
								}
							}
						}
					}

				};

        $scope.updatePlantings = function() {
            var gardenpart = $scope.gardenpart ;

            //convert position to absolute for all plantings and put the id in place of the plantvariety
            var plantings = $scope.plantings;
            for(var i=0;i<plantings.length;i++){
                plantings[i].elemtop = parseInt(plantings[i].elemtop) + parseInt(gardenpart.elemtop);
                plantings[i].elemleft = parseInt(plantings[i].elemleft) + parseInt(gardenpart.elemleft);
                plantings[i].plantVariety = plantings[i].plantVariety._id;
            }

            Plantings.createPlantings({bk:gardenpart.garden,selectedDate:$stateParams.selectedDate},$scope.newplantings);
            Plantings.cancelPlantings({bk:gardenpart.garden,selectedDate:$stateParams.selectedDate},$scope.cancelPlantings);

            for(i=0;i<$scope.harvests .length;i++){
                $scope.harvests[i].$save();
            }

            $location.path('gardens/' + gardenpart.garden + '/' + $stateParams.selectedDate);
        };

        $scope.$on('addPlantvariety', function(event, plantvariety) {
            var newplanting = {
                garden: $scope.gardenpart.garden,
                validFrom: $stateParams.selectedDate,
                plantVariety:plantvariety,
                elemwidth: plantvariety.cmInRow*2,
                elemheight:plantvariety.cmBetweenRow*2,
                elemtop: 0,
                elemleft:0,
                orientation: 'horizontal',
                cmBetweenRow: plantvariety.cmBetweenRow,
                cmInRow: plantvariety.cmInRow
            };
            $scope.newplantings.push(newplanting);
            $scope.plantings.push(newplanting);
            console.log('plantvariety clicked! '+plantvariety.name);
        });

        $scope.cancelNewPlanting = function(planting){
            var index = $scope.newplantings.indexOf(planting);
            $scope.newplantings.splice(index, 1);
        };

        $scope.cancelPlanting = function(planting){
            $scope.cancelPlantings.push(planting[0]._id);
        };

        $scope.getPlantvarieties = function(){
            console.log('$stateParams.selectedDate'+  $stateParams.selectedDate );
            var datearray = $stateParams.selectedDate.split('-');
						console.log('datearray: '+ datearray);
            var now = new Date();
            now.setYear(datearray[0]);
            console.log('year: '+ datearray[0]);
						var month = datearray[1]-1;
            now.setMonth(month);
            console.log('month: '+ month);
            now.setDate(datearray[2]);
            console.log('dag: '+ datearray[2]);
            var start = new Date(now.getFullYear(), 0, 0);
						console.log ('start: '+start);
						console.log ('now: '+now);
            var diff = now - start;
            var oneDay = 1000 * 60 * 60 * 24;
            var day = Math.floor(diff / oneDay);
						console.log('doy: '+day);
            $scope.plantvarieties = Plantvarieties.get({'doy':day});
            $scope.plantvarieties.$promise.then(function(plantvarieties){
                for(var i=0;i<plantvarieties.length;i++){
                    var plant = plantvarieties[i];

                    var newCrop = true;
										var j =0;
										while(newCrop===true && j<$scope.crops.length){
											var crop = $scope.crops[j];
											if(crop._id === plant.crop._id){
													plant.crop = plant.crop._id; //Avoid recursion
													newCrop = false;
													crop.plantvarieties.push(plant);
											}
											j++;
										}
										if(newCrop){
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
      $scope.getPlantvarieties();
			$scope.gardenpart = Gardenpart.get({
				bk: $stateParams.bk,
        selectedDate: $stateParams.selectedDate
			});
            // promise then gardenpart.gardenbk
            $scope.gardenpart.$promise.then(function(gardenpart) {

                //TODO: check if the whole gardenobject is required
                $scope.garden = Gardens.get({
                    bk: gardenpart.garden,
                    selectedDate: $stateParams.selectedDate
                });
                //Add the plantings
                var plantings = gardenpart.plantings;
                var gardenparttop = parseInt(gardenpart.elemtop);
                var gardenpartleft =parseInt(gardenpart.elemleft);
                for(var i=0;i<plantings.length;i++){
                    plantings[i].elemtop = parseInt(plantings[i].elemtop) - gardenparttop;
                    plantings[i].elemleft = parseInt(plantings[i].elemleft) - gardenpartleft;
                }
                $scope.plantings = gardenpart.plantings;

								$scope.ruleSets = RuleSets.query();

								$scope.ruleSets.$promise.then(function(ruleSets){
									var ruleSet = true;
									if(gardenpart.ruleset === undefined){
										gardenpart.ruleset='5688553504e0daf62b4b8906';
									}
									for(var r=0;r<ruleSets.length;r++){
										if(ruleSets[r]._id === gardenpart.ruleset){
											$scope.ruleSet = ruleSet = ruleSets[r];
											break;
										}
									}

									$scope.pastplantings = PastPlantings.get({
											bk: $stateParams.bk,
											selectedDate: $stateParams.selectedDate
									});
									$scope.pastplantings.$promise.then(function(pastp){
											//Add the pastplantings
											var pp = $scope.pastplantings;
											for(var j=0;j<pp.length;j++){
													var planting = pp[j];
													planting.elemtop = parseInt(planting.elemtop) - gardenparttop;
													planting.elemleft = parseInt(planting.elemleft) - gardenpartleft;
													//assign a cropgroup to the past plantings
													for(var m=0;m<ruleSet.cropgroups.length;m++){
														if(ruleSet.cropgroups[m].crops.indexOf(planting.plantVariety.crop)!==-1){
															planting.cropgroup = ruleSet.cropgroups[m]._id;
															break;
														}
													}
											}
											$scope.rotationAdvice($scope.crops[0]._id);
											$scope.$emit('plantingsLoaded');
									});
								});
            });
        };
	}
]);
