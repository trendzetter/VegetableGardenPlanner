(function() {
  'use strict';

  angular
    .module('rule-sets')
    .controller('RuleSetsController', RuleSetsController);

  RuleSetsController.$inject = ['$scope', '$state', 'ruleSetResolve', 'Authentication', 'CropsService'];

  function RuleSetsController($scope, $state, ruleset, Authentication, Crops) {
    var vm = this;
    vm.ruleset = ruleset;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.removeGroup = removeGroup;
    vm.removeRule = removeRule;

    vm.crops = Crops.query();
    vm.crops.$promise.then(function(crops) {
      var cropgroup;
      if (!ruleset._id) {
        console.log('nieuwe ruleset');
        vm.ruleset.cropgroups = [];
        vm.ruleset.rotationrules = [];
        newRule();
        loop:
          for (var i = 0; i < crops.length; i++) {
            for (var j = 0; j < vm.ruleset.cropgroups.length; j++) {
              if (vm.ruleset.cropgroups[j].name === crops[i].plantfamily.name) {
                vm.ruleset.cropgroups[j].crops.push(crops[i]);
                continue loop;
              }
            }
            cropgroup = newCropgroup(crops[i].plantfamily.name);
            cropgroup.crops.push(crops[i]);
          }
      } else {
        for (var l = 0; l < vm.ruleset.cropgroups.length; l++) {
          cropgroup = vm.ruleset.cropgroups[l];
          for (var k = 0; k < cropgroup.crops.length; k++) {
            var index = crops.indexOf(cropgroup.crops[k]);
            crops.splice(index, 1);
          }
        }
        vm.ordercrops = crops;
      }
    });

    function removeRule(index) {
      console.log('remove rule:' + index);
      vm.ruleset.rotationrules.splice(index, 1);
    }

    function removeGroup(index) {
      console.log('removeGroup:' + index);
      var count = 0;
      var cropgroup = vm.ruleset.cropgroups[index];
      while (count !== vm.ruleset.rotationrules.length) {
        if (vm.ruleset.rotationrules[count].previousCropgroup === cropgroup._id || vm.ruleset.rotationrules[count].cropgroup === cropgroup._id) {
          vm.ruleset.rotationrules.splice(count, 1);
        } else {
          count++;
        }
      }
      while (vm.ruleset.cropgroups[index].crops.length > 0) {
        vm.ordercrops.push(vm.ruleset.cropgroups[index].crops.pop());
      }
      vm.ruleset.cropgroups.splice(index, 1);
    }

    function newCropgroup(name) {
      var cropgroup = {};
      if (name === undefined) {
        cropgroup.name = 'Geef de groep een naam';
      } else {
        cropgroup.name = name;
      }

      cropgroup.crops = [];
      vm.ruleset.cropgroups.push(cropgroup);
      return cropgroup;
    }

    $scope.newCropgroup = newCropgroup;

    function newRule() {
      var rule = {};
      vm.ruleset.rotationrules.push(rule);
    }

    $scope.newRule = newRule;

    // Remove existing Article
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.ruleset.$remove($state.go('rulesets.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.rulesetForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.ruleset._id) {
        vm.ruleset.$update(successCallback, errorCallback);
      } else {
        vm.ruleset.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('rulesets.view', {
          ruleSetId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
