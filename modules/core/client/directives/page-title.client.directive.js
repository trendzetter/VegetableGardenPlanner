(function () {
  'use strict';

  angular.module('core')
    .directive('pageTitle', pageTitle);

  pageTitle.$inject = ['$rootScope', '$interpolate', '$state','$translate'];

  function pageTitle($rootScope, $interpolate, $state,$translate) {
    var directive = {
      restrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element) {
      $rootScope.$on('$stateChangeSuccess', listener);

      function listener(event, toState) {
        $translate('vegetable_garden_planner').then(function (applicationCoreTitle) {
        if (toState.data && toState.data.pageTitle) {
          var stateTitle = $interpolate(toState.data.pageTitle)($state.$current.locals.globals);
          $translate(stateTitle).then(function (translation) {
            element.html(applicationCoreTitle + ' - ' + translation);
          });
        } else {
            element.html(applicationCoreTitle);
        }
        });
      }
    }
  }
}());
