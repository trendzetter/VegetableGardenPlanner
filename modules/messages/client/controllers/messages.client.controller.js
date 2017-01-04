(function () {
  'use strict';

  angular
    .module('messages')
    .controller('MessagesController', MessagesController);

  MessagesController.$inject = ['$scope', 'messageResolve', 'Authentication'];

  function MessagesController($scope, message, Authentication) {
    var vm = this;

    vm.message = message;
    vm.authentication = Authentication;
    vm.error = null;

  }
}());
