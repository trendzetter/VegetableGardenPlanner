(function () {
  'use strict';

  angular
    .module('rule-sets')
    .controller('RuleSetsController', RuleSetsController);

  RuleSetsController.$inject = ['$scope', '$state', 'ruleSetResolve', 'Authentication','CropsService'];

  function RuleSetsController($scope, $state, ruleset, Authentication,Crops) {
    var vm = this;

    vm.ruleset = ruleset;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.cropgroups = [];
    vm.ruleSet = {};
    vm.ruleSet.rotationrules = [];
    newRule();
    vm.crops = Crops.query();
    vm.crops.$promise.then(function(crops) {
      loop:
      for(var i=0;i<crops.length;i++){
          for(var j=0;j<vm.cropgroups.length;j++){
            if(vm.cropgroups[j].name === crops[i].plantfamily.name){
              vm.cropgroups[j].crops.push(crops[i]);
              continue loop;
            }
          }
          var cropgroup = newCropgroup(crops[i].plantfamily.name);
          cropgroup.crops.push(crops[i]);
      }
    });

  function newCropgroup (name){
      var cropgroup = {};
      if(name === undefined){
        cropgroup.name = 'Geef de groep een naam';
      } else {
        cropgroup.name = name;
      }

      cropgroup.crops = [];
      vm.cropgroups.push(cropgroup);
      return cropgroup;
    }

    $scope.newCropgroup = newCropgroup;

    function newRule(){
      var rule = {};
      vm.ruleSet.rotationrules.push(rule);
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
