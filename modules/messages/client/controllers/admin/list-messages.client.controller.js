(function () {
  'use strict';

  angular
    .module('messages.admin')
    .controller('MessagesAdminListController', MessagesAdminListController);

  MessagesAdminListController.$inject = ['MessagesService'];

  function MessagesAdminListController(MessagesService) {
    var vm = this;

    vm.messages = MessagesService.query();
  }
}());
