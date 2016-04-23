'use strict';

// Harvests controller
angular.module('harvests').controller('HarvestsController', ['$scope', '$uibModalInstance', '$stateParams', '$location', 'Authentication', 'Harvests', 'planting', // planting van resolve in aanmaak modal
  function($scope, $uibModalInstance, $stateParams, $location, Authentication, Harvests, planting) {

    $scope.newHarvest = function() {
      console.log('planting in harvest: ' + JSON.stringify(planting));
      $scope.planting = planting;
      $scope.harvest = {};
      $scope.harvest.issues = [];
      $scope.harvest.gotchas = [];
      $scope.newIssue();
      $scope.newGotcha();
    };

    $scope.newIssue = function() {
      var issue = {};
      issue.plantvariety = planting.plantVariety;
      $scope.harvest.issues.push(issue);
    };

    $scope.newGotcha = function() {
      var gotcha = {};
      gotcha.plantvariety = planting.plantVariety;
      $scope.harvest.gotchas.push(gotcha);
    };

    $scope.authentication = Authentication;

    // Create new Harvest
    $scope.create = function() {
      // Create new Harvest object
      console.log('plantvarid: ' + planting.plantVariety._id);
      planting.validTo = $stateParams.selectedDate;
      var har = $scope.harvest;
      var issues = [];
      var i;
      for (i = 0; i < har.issues.length; i++) {
        har.issues[i].plantvariety = har.issues[i].plantvariety._id;
      }
      for (i = 0; i < har.gotchas.length; i++) {
        har.gotchas[i].plantvariety = har.gotchas[i].plantvariety._id;
      }
      var harvest = new Harvests({
        garden: planting.garden,
        planting: planting._id,
        quantity: har.quantity,
        unit: har.unit,
        issues: har.issues,
        gotchas: har.gotchas,
        date: $stateParams.selectedDate
      });
      $uibModalInstance.close(harvest);

    };

    // Remove existing Harvest
    $scope.remove = function(harvest) {
      if (harvest) {
        harvest.$remove();

        for (var i in $scope.harvests) {
          if ($scope.harvests[i] === harvest) {
            $scope.harvests.splice(i, 1);
          }
        }
      } else {
        $scope.harvest.$remove(function() {
          $location.path('harvests');
        });
      }
    };

    // Update existing Harvest
    $scope.update = function() {
      var harvest = $scope.harvest;

      harvest.$update(function() {
        $location.path('harvests/' + harvest._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Harvests
    $scope.find = function() {
      $scope.harvests = Harvests.query();
    };

    // Find existing Harvest
    $scope.findOne = function() {
      $scope.harvest = Harvests.get({
        harvestId: $stateParams.harvestId
      });
    };
  }
]);
