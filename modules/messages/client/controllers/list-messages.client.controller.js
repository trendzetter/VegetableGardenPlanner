(function () {
  'use strict';

  angular
    .module('messages')
    .controller('MessagesListController', MessagesListController);

  MessagesListController.$inject = ['MessagesService'];

  function MessagesListController(MessagesService) {
    var vm = this;

    vm.messages = MessagesService.query();
  }
}());
