(function () {
  'use strict';

  angular
    .module('notifications')
    .controller('NotificationsController', NotificationsController);

  NotificationsController.$inject = ['$scope', 'notificationResolve', 'Authentication'];

  function NotificationsController($scope, notification, Authentication) {
    var vm = this;

    vm.notification = notification;
    vm.authentication = Authentication;
    vm.error = null;

  }
}());
