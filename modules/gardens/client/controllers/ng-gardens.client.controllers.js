(function () {
  'use strict';

  angular
    .module('gardens')
    .controller('GardensNgController', GardensNgController);

  GardensNgController.$inject = ['$scope', '$state', 'gardenResolve', 'Authentication','$stateParams','GardenpartsService','Users','RuleSetsService'];

  function GardensNgController($scope, $state, garden, Authentication,$stateParams,GardenpartsService,Users,RuleSetsService) {

    var vm = this;

    vm.garden = garden;
    vm.authentication = Authentication;
    vm.selectedDate = $stateParams.selectedDate;
    vm.rulesets = RuleSetsService.query();
    vm.zoom = 1;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.setDate = function(date) {
      vm.selectedDate = date;
    };

    if($state.current.name === 'editGarden'){
      // During edit > resize
      $scope.updateCoordinates = function(top, left, height, width) {

        var cancel = false;
        if (top !== vm.garden.elemtop) {
          //Controleren of alle parts erin passen
          angular.forEach(vm.garden.gardenparts, function(gardenpart, key) {
            var newposition = gardenpart.elemtop - (top - vm.garden.elemtop);
            if (newposition < 0) {
              cancel = true;
            }
          });
          //En wijzigingen doorvoeren aan gardenparts en garden
          if (!cancel) {
            angular.forEach(vm.garden.gardenparts, function(gardenpart, key) {
              var newposition = gardenpart.elemtop - (top - vm.garden.elemtop);
              gardenpart.elemtop = newposition;
            });
            vm.garden.elemtop = top;
            $scope.minHeight = $scope.initialMinHeight + ($scope.initialTop - top);
            //Of een correctie doen aan de hoogte.
          } else {
            height = vm.garden.elemheight;
          }

        }
        if (left !== vm.garden.elemleft && !cancel) {
          //Controleren of alle parts erin passen
          angular.forEach(vm.garden.gardenparts, function(gardenpart, key) {
            var newposition = gardenpart.elemleft - (left - vm.garden.elemleft);
            if (newposition < 0) {
              cancel = true;
            }
          });
          //En wijzigingen doorvoeren aan gardenparts en garden
          if (!cancel) {
            angular.forEach(vm.garden.gardenparts, function(gardenpart, key) {
              var newposition = gardenpart.elemleft - (left - vm.garden.elemleft);
              gardenpart.elemleft = newposition;
            });
            vm.garden.elemleft = left;
            $scope.minWidth = $scope.initialMinWidth + ($scope.initialLeft - left);
            //Of een correctie doen aan de breedte.
          } else {
            width = vm.garden.elemwidth;
          }
        }

        vm.garden.elemwidth = width;
        vm.garden.elemheight = height;

        var opp = (height * width / 10000);
        $scope.tooltiptext = 'breedte: ' + height + ' cm<br />lengte: ' + width + ' cm' + '<br />oppervlakte: ' + opp + ' m²<br /> ± ' + Math.round(opp / 15) + ' personen';
        return cancel;
      };
    }

    if($state.current.name === 'createGarden'){
      var today = new Date();
      vm.selectedDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);
      vm.garden.ruleset = '5688553504e0daf62b4b8906';
      console.log('vm.selectedDate'+vm.selectedDate);
          // During create > resize
        $scope.updateCoordinates = function(top, left, height, width) {
          vm.garden.elemtop = top;
          vm.garden.elemleft = left;
          vm.garden.elemwidth = width;
          vm.garden.elemheight = height;
          var opp = Math.round(height * width / 10000);
          $scope.tooltiptext = 'breedte: ' + height + ' cm lengte: ' + width + ' cm ' + 'oppervlakte: ' + opp + ' m² ± ' + Math.round(height * width / 150000) + ' personen';
        };
      }

      $scope.addKeeper = function() {
        vm.error = '';
        if (vm.newkeeper === vm.authentication.user.username) {
          vm.error = 'You don\'t need to add yourself';
        } else {
          Users.get({
            name: vm.newkeeper
          }).$promise.then(
            function(user) {
              if(!vm.garden.keepers) vm.garden.keepers = [];
              vm.garden.keepers.push(user);
              vm.newkeeper = '';
            },
            function(errorResponse) {
              vm.error = errorResponse.data.message;
            });
        }
      };

    // Remove existing garden
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.garden.$remove($state.go('gardens.list'));
      }
    }

    function updateParts(){
      // Update existing Gardenparts
        var garden = vm.garden;
      //  var newparts._id = garden._id;
        var gardenparts = vm.garden.gardenparts;
        //convert position to absolute for all gardenparts
        for (var i = 0; i < gardenparts.length; i++) {
          gardenparts[i].elemtop = parseInt(gardenparts[i].elemtop) + parseInt(garden.elemtop);
          gardenparts[i].elemleft = parseInt(gardenparts[i].elemleft) + parseInt(garden.elemleft);
        }

    /*    GardenpartsService.createParts({
          bk: garden.bk,
          selectedDate: $stateParams.selectedDate
        }, newparts);*/

        //Update the modified parts
        //Filter new parts
    /*    var filtered = gardenparts.filter(function(x) {
          return newparts.indexOf(x) < 0;
        });*/
        var modified = [];
        for (i = 0; i < gardenparts.length; i++) {
          if (gardenparts[i].modified) {
            delete gardenparts[i].modified;
            modified.push(gardenparts[i]);
          }
        }
        if (modified.length > 0)
          GardenpartsService.updateParts({
            bk: garden.bk,
            selectedDate: $stateParams.selectedDate
          }, modified);

    /*    GardenpartsService.deleteParts({
          bk: garden.bk,
          selectedDate: $stateParams.selectedDate
        }, delparts);
        $state.go('viewGarden', {
          bk: garden.bk,
          selectedDate: $scope.selectedDate
        });*/
      }
      $scope.back = function  (){
        console.log('back!'+JSON.stringify($state.previous));
        $state.go($state.previous.state.name,$state.previous.params);
      };

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.gardenForm');
        return false;
      }

      if (vm.garden._id) {
        // Update position/dimentions existing Garden
          updateParts();
          var garden = vm.garden;
          garden.validFrom = $stateParams.selectedDate;
          var leankeepers = [];
          var keepers = vm.garden.keepers;
          console.log('vm.garden.keepers: '+vm.garden.keepers);
          for (var i = 0; i < keepers.length; i++) {
            console.log('garden.keepers[i]' + keepers[i]._id);
            leankeepers.push(keepers[i]._id);
          }
          garden.keepers = leankeepers;
          console.log('garden.keepers' + garden.keepers);
          if($state.$current.data && $state.$current.data.name==='gardens.create') $stateParams.selectedDate=$scope.selectedDate;
          garden.selectedDate  = $stateParams.selectedDate;
          garden.$update({
              selectedDate: $stateParams.selectedDate
            },successCallback, errorCallback);

        //vm.garden.$update(successCallback, errorCallback);
        //vm.garden.$update({selectedDate:$stateParams.selectedDate},successCallback, errorCallback);
      } else {
        vm.garden.validFrom = new Date(0);
        vm.garden.$save(successCallback, errorCallback);
      }
    }
      function successCallback(res) {
        if($state.current.name === 'createGarden'){
          $state.go('designGarden', {
            gardenId: res._id,
            selectedDate: vm.selectedDate
          });
        } else {
          $state.go('viewGarden', {
            bk: $stateParams.bk,
            selectedDate: $stateParams.selectedDate
          });
        }

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
})();
