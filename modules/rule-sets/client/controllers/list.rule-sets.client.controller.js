(function () {
  'use strict';

  angular
    .module('rule-sets')
    .controller('RuleSetsListController', RuleSetsListController);

  RuleSetsListController.$inject = ['RuleSetsService'];

  function RuleSetsListController(RuleSetsService) {
    var vm = this;

    vm.rulesets = RuleSetsService.query();
  }
}());
