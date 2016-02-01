'use strict';

angular.module('gardens').controller('EditformController', ['$scope','$rootScope','Gardendata','Users','$stateParams',
	function($scope,$rootScope, Gardendata,Users,$stateParams) {
		$scope.selectedDate = $stateParams.selectedDate;

        $scope.updateGarden = function(){
            $rootScope.$broadcast('updateGarden');
        };
        $scope.garden = Gardendata.getGarden();
				$scope.garden.$promise.then(function(){
					console.log('garden'+$scope.garden.bk)
					$scope.bk = $scope.garden.bk;
				})


				$scope.addKeeper = function(){
					$scope.error = '';
					if($scope.newkeeper === $scope.garden.user.username){
						$scope.error = 'You don\'t need to add yourself';
					} else {
						Users.get({name: $scope.newkeeper}).$promise.then(
							function(user){
								$scope.garden.keepers.push(user);
								$scope.newkeeper = '';
							},
							function(errorResponse) {
								$scope.error = errorResponse.data.message;
							});
					}
				};
	}
]);
