(function () {
  'use strict';

  angular
    .module('cultivation-plans.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cultivation-plans', {
        abstract: true,
        url: '/cultivation-plans',
        template: '<ui-view/>'
      })
      .state('cultivation-plans.list', {
        url: '',
        templateUrl: '/modules/cultivation-plans/client/views/list-cultivation-plans.client.view.html',
        controller: 'CultivationPlansListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'cultivation-plans List'
        }
      })
      .state('cultivation-plans.create', {
        url: '/create',
        templateUrl: '/modules/cultivation-plans/client/views/form-cultivation-plan.client.view.html',
        controller: 'CultivationPlansController',
        controllerAs: 'vm',
        resolve: {
          cultivationPlanResolve: newCultivationPlan
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'cultivation-plans Create'
        }
      })
      .state('cultivation-plans.edit', {
        url: '/:cultivationPlanId/edit',
        templateUrl: '/modules/cultivation-plans/client/views/form-cultivation-plan.client.view.html',
        controller: 'CultivationPlansController',
        controllerAs: 'vm',
        resolve: {
          cultivationPlanResolve: getCultivationPlan
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit CultivationPlan {{ cultivationPlanResolve.title }}'
        }
      })
      .state('cultivation-plans.view', {
        url: '/:cultivationPlanId',
        templateUrl: '/modules/cultivation-plans/client/views/view-cultivation-plan.client.view.html',
        controller: 'CultivationPlansController',
        controllerAs: 'vm',
        resolve: {
          cultivationPlanResolve: getCultivationPlan
        },
        data: {
          pageTitle: 'CultivationPlan {{ cultivationPlanResolve.title }}'
        }
      });
  }

  getCultivationPlan.$inject = ['$stateParams', 'CultivationPlansService'];

  function getCultivationPlan($stateParams, CultivationPlansService) {
    return CultivationPlansService.get({
      cultivationPlanId: $stateParams.cultivationPlanId
    }).$promise;
  }

  newCultivationPlan.$inject = ['CultivationPlansService'];

  function newCultivationPlan(CultivationPlansService) {
    return new CultivationPlansService();
  }
}());
