'use strict';

angular.module('gardens').controller('FormController', ['$scope','Gardendata', 'Authentication','$rootScope',
function($scope, Gardendata, Authentication,$rootScope) {
	$scope.create = function(){
		$rootScope.$broadcast('createGarden');
	};

	$scope.updateGarden = function(){
		Gardendata.setGarden($scope.garden);
	};

	$scope.$on('error', function() {
		$scope.error = Gardendata.getError();
	});
	$scope.authentication = Authentication;
	$scope.garden = Gardendata.getGarden();

}
]);
