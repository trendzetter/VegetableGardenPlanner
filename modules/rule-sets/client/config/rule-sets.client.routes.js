(function () {
  'use strict';

  angular
  .module('rule-sets.routes')
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('rulesets', {
        abstract: true,
        url: '/rulesets',
        template: '<ui-view/>'
      })
      .state('rulesets.list', {
        url: '',
        templateUrl: '/modules/rule-sets/client/views/list-rule-sets.client.view.html',
        controller: 'RuleSetsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'rule_set_list'
        }
      })
      .state('rulesets.create', {
        url: '/create',
        templateUrl: '/modules/rule-sets/client/views/form-rule-set.client.view.html',
        controller: 'RuleSetsController',
        controllerAs: 'vm',
        resolve: {
          ruleSetResolve: newRuleset
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'add_rule_set'
        }
      })
      .state('rulesets.edit', {
        url: '/:ruleSetId/edit',
        templateUrl: '/modules/rule-sets/client/views/form-rule-set.client.view.html',
        controller: 'RuleSetsController',
        controllerAs: 'vm',
        resolve: {
          ruleSetResolve: getRuleSet
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'edit_rule_set'
        }
      })
      .state('rulesets.view', {
        url: '/:ruleSetId',
        templateUrl: '/modules/rule-sets/client/views/view-rule-set.client.view.html',
        controller: 'RuleSetsController',
        controllerAs: 'vm',
        resolve: {
          ruleSetResolve: getRuleSet
        },
        data: {
          pageTitle: 'view_rule_set'
        }
      });
  }

  getRuleSet.$inject = ['$stateParams', 'RuleSetsService'];

  function getRuleSet($stateParams, RuleSetsService) {
    return RuleSetsService.get({
      ruleSetId: $stateParams.ruleSetId
    }).$promise;
  }

  newRuleset.$inject = ['RuleSetsService'];

  function newRuleset(RuleSetsService) {
    return new RuleSetsService();
  }
}());
