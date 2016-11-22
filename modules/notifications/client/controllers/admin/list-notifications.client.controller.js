(function () {
  'use strict';

  angular
    .module('notifications.admin')
    .controller('NotificationsAdminListController', NotificationsAdminListController);

  NotificationsAdminListController.$inject = ['NotificationsService'];

  function NotificationsAdminListController(NotificationsService) {
    var vm = this;

    vm.notifications = NotificationsService.query();
  }
}());
