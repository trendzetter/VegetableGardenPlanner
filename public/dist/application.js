'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if ((role === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1)) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

(function (app) {
  'use strict';

  app.registerModule('articles');
  app.registerModule('articles.services');
  app.registerModule('articles.routes', ['ui.router', 'articles.services']);
})(ApplicationConfiguration);

(function (app) {
  'use strict';

  app.registerModule('chat');
  app.registerModule('chat.routes', ['ui.router']);
})(ApplicationConfiguration);

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

(function (app) {
  'use strict';

  app.registerModule('crops');
  app.registerModule('crops.services');
  app.registerModule('crops.routes', ['ui.router', 'crops.services']);
})(ApplicationConfiguration);

(function (app) {
  'use strict';

  app.registerModule('gardenparts');
  app.registerModule('gardenparts.services');
  app.registerModule('gardenparts.routes', ['ui.router', 'gardenparts.services']);
})(ApplicationConfiguration);

(function (app) {
  'use strict';

  app.registerModule('gardens');
  app.registerModule('gardens.services');
  app.registerModule('gardens.routes', ['ui.router', 'gardens.services']);
})(ApplicationConfiguration);

(function (app) {
  'use strict';

  app.registerModule('plantfamilies');
  app.registerModule('plantfamilies.services');
  app.registerModule('plantfamilies.routes', ['ui.router', 'plantfamilies.services']);
})(ApplicationConfiguration);

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

(function () {
  'use strict';

  angular
    .module('articles')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'List Articles',
      state: 'articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create Article',
      state: 'articles.create',
      roles: ['user']
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('articles.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/articles/client/views/list-articles.client.view.html',
        controller: 'ArticlesListController',
        controllerAs: 'vm'
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/articles/client/views/form-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: newArticle
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/form-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getArticle
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/client/views/view-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getArticle
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'ArticlesService'];

  function getArticle($stateParams, ArticlesService) {
    return ArticlesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticle.$inject = ['ArticlesService'];

  function newArticle(ArticlesService) {
    return new ArticlesService();
  }
})();

(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', 'articleResolve', 'Authentication'];

  function ArticlesController($scope, $state, article, Authentication) {
    var vm = this;

    vm.article = article;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.article.$remove($state.go('articles.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.article._id) {
        vm.article.$update(successCallback, errorCallback);
      } else {
        vm.article.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('articles.view', {
          articleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService'];

  function ArticlesListController(ArticlesService) {
    var vm = this;

    vm.articles = ArticlesService.query();
  }
})();

(function () {
  'use strict';

  angular
    .module('articles.services')
    .factory('ArticlesService', ArticlesService);

  ArticlesService.$inject = ['$resource'];

  function ArticlesService($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('chat')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Chat',
      state: 'chat'
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('chat.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: 'modules/chat/client/views/chat.client.view.html',
        controller: 'ChatController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
})();

(function () {
  'use strict';

  angular
    .module('chat')
    .controller('ChatController', ChatController);

  ChatController.$inject = ['$scope', '$state', 'Authentication', 'Socket'];

  function ChatController($scope, $state, Authentication, Socket) {
    var vm = this;

    vm.messages = [];
    vm.messageText = '';
    vm.sendMessage = sendMessage;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }

      // Add an event listener to the 'chatMessage' event
      Socket.on('chatMessage', function (message) {
        vm.messages.unshift(message);
      });

      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.removeListener('chatMessage');
      });
    }

    // Create a controller method for sending messages
    function sendMessage() {
      // Create a new message object
      var message = {
        text: vm.messageText
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      vm.messageText = '';
    }
  }
})();

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

(function () {
  'use strict';

  angular
  .module('core')
  .run(MenuConfig);

  MenuConfig.$inject = ['Menus'];

  function MenuConfig(Menus) {

    Menus.addMenu('account', {
      roles: ['user']
    });

    Menus.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      state: 'settings.profile'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile Picture',
      state: 'settings.picture'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Manage Social Accounts',
      state: 'settings.accounts'
    });

  }

})();

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Get the account menu
    $scope.accountMenu = Menus.getMenu('account').items[0];

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector', 'Authentication',
  function ($q, $injector, Authentication) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

(function () {
  'use strict';

  angular
    .module('crops')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Crops',
      state: 'crops',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'crops', {
      title: 'List crops',
      state: 'crops.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'crops', {
      title: 'Create crop',
      state: 'crops.create',
      roles: ['user']
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('crops.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('crops', {
        abstract: true,
        url: '/crops',
        template: '<ui-view/>'
      })
      .state('crops.list', {
        url: '',
        templateUrl: 'modules/crops/client/views/list-crops.client.view.html',
        controller: 'CropsListController',
        controllerAs: 'vm'
      })
      .state('crops.create', {
        url: '/create',
        templateUrl: 'modules/crops/client/views/form-crop.client.view.html',
        controller: 'CropsController',
        controllerAs: 'vm',
        resolve: {
          cropResolve: newCrop
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('crops.edit', {
        url: '/:cropId/edit',
        templateUrl: 'modules/crops/client/views/form-crop.client.view.html',
        controller: 'CropsController',
        controllerAs: 'vm',
        resolve: {
          cropResolve: getCrop
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('crops.view', {
        url: '/:cropId',
        templateUrl: 'modules/crops/client/views/view-crop.client.view.html',
        controller: 'CropsController',
        controllerAs: 'vm',
        resolve: {
          cropResolve: getCrop
        }
      });
  }

  getCrop.$inject = ['$stateParams', 'CropsService'];

  function getCrop($stateParams, CropsService) {
    return CropsService.get({
      cropId: $stateParams.cropId
    }).$promise;
  }

  newCrop.$inject = ['CropsService'];

  function newCrop(CropsService) {
    return new CropsService();
  }
})();

(function () {
  'use strict';

  angular
    .module('crops')
    .controller('CropsController', CropsController);

  CropsController.$inject = ['$scope', '$state', 'cropResolve', 'Authentication','PlantFamilyService'];

  function CropsController($scope, $state, crop, Authentication,PlantFamilyService) {
    var vm = this;

    vm.crop = crop;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    //adding the list of plantfamilies
    if($state.current.name === 'crops.edit'){
      vm.plantfamilies = PlantFamilyService.query();
    }

    // Remove existing Crop
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.crop.$remove($state.go('crops.list'));
      }
    }

    // Save Crop
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cropForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.crop._id) {
        vm.crop.$update(successCallback, errorCallback);
      } else {
        vm.crop.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('crops.view', {
          cropId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('crops')
    .controller('CropsListController', CropsListController);

  CropsListController.$inject = ['CropsService'];

  function CropsListController(CropsService) {
    var vm = this;

    vm.crops = CropsService.query();
  }
})();

(function () {
  'use strict';

  angular
    .module('crops.services')
    .factory('CropsService', CropsService);

  CropsService.$inject = ['$resource'];

  function CropsService($resource) {
    return $resource('api/crops/:cropId', {
      cropId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

'use strict';

//Gardens service used to communicate Gardens REST endpoints
angular.module('gardenparts').factory('Gardenpart', ['$resource',
function($resource) {
  return $resource('gardenparts/:bk/:selectedDate', { selectedDate: '@selectedDate', bk: '@bk' //gardenId: '@_id',
}, {
  createParts: {
    method: 'PUT',
    isArray : true
  },
  updateParts: {
    method: 'POST',
    isArray : true
  },
  deleteParts: {
    method: 'POST',
    url: '/gardenparts/delete/:bk/:selectedDate',
    isArray: true
  }
});
}
]);

(function () {
  'use strict';

  angular
    .module('gardens')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Gardens',
      state: 'gardens',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'List Gardens',
      state: 'gardens.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'gardens', {
      title: 'Create Garden',
      state: 'gardens.create',
      roles: ['user']
    });
  }
})();

'use strict';

//Setting up route
angular.module('gardens').config(['$stateProvider',
function($stateProvider) {
	// Gardens state routing
  $stateProvider.
	state('listGardens', {
		url: '/gardens',
		templateUrl: 'modules/gardens/client/views/list-gardens.client.view.html'
	}).
	state('plantListGardens', {
		url: '/gardens/plant/:plantVariety',
		templateUrl: 'modules/gardens/client/views/list-gardens.client.view.html'
	}).
	state('listGardenversions', {
		url: '/gardenversions',
		templateUrl: 'modules/gardens/client/views/list-garden-versions.client.view.html'
	}).
	state('createGarden', {
		url: '/gardens/create',
		templateUrl: 'modules/gardens/client/views/create-garden.client.view.html'
	}).
	state('viewGarden', {
		url: '/gardens/:bk/:selectedDate',
		templateUrl: 'modules/gardens/client/views/view-garden.client.view.html'
  }).
  state('viewGardenversion', {
		url: '/gardenversion/:gardenId/:selectedDate',
    templateUrl: 'modules/gardens/client/views/view-gardenversion.client.view.html'
  }).
	state('editGarden', {
		url: '/gardens/:gardenId/edit/:selectedDate',
		templateUrl: 'modules/gardens/client/views/edit-garden.client.view.html'
	}).
	state('designGarden', {
		url: '/gardens/:gardenId/layout/:selectedDate',
		templateUrl: 'modules/gardens/client/views/layout-garden.client.view.html'
	});
}
]);

(function () {
  'use strict';

  angular
    .module('gardens.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('gardens', {
        abstract: true,
        url: '/gardens',
        template: '<ui-view/>'
      })
      .state('gardens.list', {
        url: '',
        templateUrl: 'modules/gardens/client/views/list-gardens.client.view.html',
        controller: 'GardensListController',
        controllerAs: 'vm'
      })
      .state('gardens.create', {
        url: '/create',
        templateUrl: 'modules/gardens/client/views/form-garden.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gardens.edit', {
        url: '/:gardenId/edit',
        templateUrl: 'modules/gardens/client/views/form-garden.client.view.html',
        controller: 'GardensController',
        controllerAs: 'vm',
        resolve: {
          gardenResolve: getGarden
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('gardens.view', {
        url: '/:gardenId',
        templateUrl: 'modules/gardens/client/views/view-garden.client.view.html',
        controller: 'GardensController',
        controllerAs: 'vm',
        resolve: {
          gardenResolve: getGarden
        }
      });
  }

  getGarden.$inject = ['$stateParams', 'GardensService'];

  function getGarden($stateParams, GardensService) {
    return GardensService.get({
      gardenId: $stateParams.gardenId
    }).$promise;
  }

  newGarden.$inject = ['GardensService'];

  function newGarden(GardensService) {
    return new GardensService();
  }
})();

'use strict';

angular.module('gardens').controller('FormController', ['$scope','Gardendata', 'Authentication','$rootScope',
function($scope, Gardendata, Authentication,$rootScope) {
	$scope.create = function(){
		$rootScope.$broadcast('createGarden');
	};

	$scope.updateGarden = function(){
		Gardendata.setGarden($scope.garden);
	};

	$scope.$on('error', function() {
		$scope.error = Gardendata.getError();
	});
	$scope.authentication = Authentication;
	$scope.garden = Gardendata.getGarden();

}
]);

'use strict';

angular.module('gardens').controller('GardenpartController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gardenpart',
	function($scope, $stateParams, $location, Authentication, Gardenpart) {
        $scope.menuOptions = [];
        /* For new plantings */
        if(typeof $scope.gardenpart._id === 'undefined'){
            $scope.menuOptions.push(['Rotate', function () {
                $scope.rotate();
            }]);
            $scope.menuOptions.push(null);// Dividier
        }

        $scope.menuOptions.push(['Remove', function () {
            var part = $scope.gardenparts.splice($scope.$index, 1);
						$scope.deletePart(part[0]);
        }]);

        $scope.update = function(top,left,width,height) {
            $scope.tooltiptext = '<br />breedte: '+height+' cm<br />lengte: '+width+' cm'+'<br />oppervlakte: '+(height*width/10000)+' m²';
            var gardenpart = $scope.gardenpart;
            gardenpart.elemtop = top;
            gardenpart.elemleft = left;
            gardenpart.elemwidth = width;
            gardenpart.elemheight = height;
          //  console.log('gardenpart controller update top: ' + gardenpart.elemtop + ' ' +  gardenpart.elemleft + ' ' + gardenpart.elemwidth + ' ' + gardenpart.elemheight);
        };
	}
]);

'use strict';

// Gardens controller
angular.module('gardens').controller('GardensController', ['$scope', '$stateParams', '$location', 'Authentication', 'GardensService', 'Gardenpart','Gardendata','$rootScope',
function($scope, $stateParams, $location, Authentication, Gardens, Gardenpart,Gardendata,$rootScope) {

	$scope.authentication = Authentication;
	console.log('authentication: ' + JSON.stringify($scope.authentication.user));
	$scope.gardenparts = [];

	$scope.tooltiptext = 'testtooltip';
	$scope.factor = 1;

	if(typeof $stateParams.selectedDate === 'undefined'){
		var today = new Date();
		$scope.selectedDate = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);
		$stateParams.selectedDate = $scope.selectedDate;
	}else {
		$scope.selectedDate = $stateParams.selectedDate;
	}

	$scope.newGarden = function(){
		$scope.garden = {};
		Gardendata.setGarden($scope.garden);
	};

	// During create > resize
	$scope.updateCoordinates = function(top,left,height,width){
		$scope.garden.elemtop = top;
		$scope.garden.elemleft = left;
		$scope.garden.elemwidth = width;
		$scope.garden.elemheight = height;
		var opp = Math.round(height*width/10000);
		$scope.tooltiptext = 'breedte: '+height+' cm lengte: '+width+' cm '+'oppervlakte: '+opp+' m² ± ' + Math.round(height*width/150000) + ' personen';
	};

	$scope.setDate = function(date){
		$stateParams.selectedDate = date;
		$scope.selectedDate = date;
	};

	// Create new Garden
	$scope.$on('createGarden', function() {
		var user = $scope.authentication.user;
		var garden = new Gardens ({
			name: $scope.garden.name,
			elemwidth: $scope.garden.elemwidth,
			elemheight: $scope.garden.elemheight,
			elemtop: $scope.garden.elemtop,
			elemleft: $scope.garden.elemleft,
			validFrom: new Date(0)
		});

		// Redirect after save
		garden.$save(function(response) {
			$location.path('gardens/' + response.bk + '/' + $stateParams.selectedDate);
		}, function(errorResponse) {
			Gardendata.setError(errorResponse.data.message);
			$rootScope.$broadcast('error');
		});
	});

	// Remove existing Garden
	$scope.remove = function( garden ) {
		if ( garden ) { garden.$remove();

			for (var i in $scope.gardens ) {
				if ($scope.gardens [i] === garden ) {
					$scope.gardens.splice(i, 1);
				}
			}
		} else {
			$scope.garden.$remove(function() {
				$location.path('gardens');
			});
		}
	};

	// Find a list of Gardens
	$scope.find = function() {
		$scope.gardens = Gardens.query({selectedDate: null});
		$scope.plantVariety = $stateParams.plantVariety;
	};

	// Find existing Garden
	$scope.findOne = function() {
		var bk;
		if(typeof $stateParams.bk === 'undefined'){
			bk = $scope.garden.bk;
		} else {
			bk = $stateParams.bk;
		}
		$scope.garden = Gardens.get({
			bk: bk,
			selectedDate: $stateParams.selectedDate
		});
		Gardendata.setGarden($scope.garden);

		$scope.garden.$promise.then(function(garden) {
			var gardenparts = garden.gardenparts;
			var plantings = garden.plantings;

			//convert position to relative for all gardenparts and add the plantings
			var gardentop = parseInt(garden.elemtop);
			var gardenleft =parseInt(garden.elemleft);

			for(var i=0;i<gardenparts.length;i++){
				var part = gardenparts[i];
				var partbottomTop = parseInt(part.elemtop) + parseInt(part.elemheight);
				var partrightLeft = parseInt(part.elemleft) + parseInt(part.elemwidth);

				part.plantings = [];
				var toRemove = [];
				for(var j=0;j<plantings.length;j++){
					var planting = plantings[j];
					console.log('next: ' );
					console.log('partbottomTop: ' + partbottomTop + ' > planting.elemtop ' + planting.elemtop +  ' > part.elemtop ' + part.elemtop);
					console.log('partrightLeft: ' + partrightLeft + ' > planting.elemleft ' + planting.elemleft +  ' > part.elemleft > ' + part.elemleft);

					if(partbottomTop > planting.elemtop &&  planting.elemtop >= part.elemtop && partrightLeft > planting.elemleft && planting.elemleft >= part.elemleft){
						//convert position to relative for all plantings
						planting.elemtop = parseInt(planting.elemtop) - parseInt(part.elemtop) ;
						planting.elemleft = parseInt(planting.elemleft) - parseInt(part.elemleft);
						part.plantings.push(planting);
						console.log('planting pushed!');
						toRemove.push(j);
					}

				}
				while(toRemove.length>0){
					plantings.splice(toRemove.pop(),1);
				}
				//convert position to relative for all gardenparts
				part.elemtop = parseInt(part.elemtop) - gardentop;
				part.elemleft = parseInt(part.elemleft) - gardenleft;
			}
			$scope.gardenparts = garden.gardenparts;
			$scope.$emit('gardenpartsLoaded');
		});
	};

}
]);

'use strict';

angular.module('gardens').controller('GardenversionsController', ['$scope','$stateParams', '$location','Authentication','GardensService', 'Gardenversions','GardenpartsService','Gardendata',
	function($scope,$stateParams,$location,Authentication,Gardens,Gardenversions,Gardenpart,Gardendata) {
        $scope.authentication = Authentication;
        $scope.gardenparts = [];
        var newparts = [];
        var delparts = [];

        if(typeof $stateParams.selectedDate === 'undefined'){
            var today = new Date();
            $scope.selectedDate = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2);
            $stateParams.selectedDate = $scope.selectedDate;
        }else {
            $scope.selectedDate = $stateParams.selectedDate;
        }

        // During edit > resize
        $scope.updateCoordinates = function(top,left,height,width){
            var cancel = false;
            if(top !== $scope.garden.elemtop){
                //Controleren of alle parts erin passen
                angular.forEach($scope.gardenparts, function(gardenpart,key){
                    var newposition = gardenpart.elemtop-(top-$scope.garden.elemtop);
                    if(newposition<0){
                        cancel = true;
                    }
                });
                //En wijzigingen doorvoeren aan gardenparts en garden
                if(!cancel){
                    angular.forEach($scope.gardenparts, function(gardenpart,key){
                        var newposition = gardenpart.elemtop-(top-$scope.garden.elemtop);
                        gardenpart.elemtop = newposition;
                    });
                    $scope.garden.elemtop = top;
                    $scope.minHeight = $scope.initialMinHeight + ($scope.initialTop - top) ;
                    //Of een correctie doen aan de hoogte.
                }else{
                    height = $scope.garden.elemheight;
                }

            }

            if(left !== $scope.garden.elemleft && ! cancel){
                //Controleren of alle parts erin passen
                angular.forEach($scope.gardenparts, function(gardenpart,key){
                    var newposition = gardenpart.elemleft-(left-$scope.garden.elemleft);
                    if(newposition<0){
                        cancel = true;
                    }
                });
                //En wijzigingen doorvoeren aan gardenparts en garden
                if(!cancel){
                    angular.forEach($scope.gardenparts, function(gardenpart,key){
                        var newposition = gardenpart.elemleft-(left-$scope.garden.elemleft);
                        gardenpart.elemleft = newposition;
                    });
                    $scope.garden.elemleft = left;
                    $scope.minWidth = $scope.initialMinWidth + ($scope.initialLeft - left) ;
                    //Of een correctie doen aan de breedte.
                }else{
                    width = $scope.garden.elemwidth;
                }
            }

            $scope.garden.elemwidth = width;
            $scope.garden.elemheight = height;

            var opp = (height*width/10000);
            $scope.tooltiptext = 'breedte: '+height+' cm<br />lengte: '+width+' cm'+'<br />oppervlakte: '+opp+' m²<br /> ± ' + Math.round(opp/15) + ' personen';
            return cancel;
        };

        $scope.deletePart = function(part){
						if(typeof part._id === 'undefined'){
							var index = newparts.indexOf(part);
							newparts.splice(index, 1);
						} else {
							console.log('delete part: '+JSON.stringify(part));
							part.validTo = $stateParams.selectedDate;
							delparts.push(part);
						}
        };

        $scope.$on('addNewGardenpart', function(event, tool) {
            var newpart = {
                garden: $scope.garden.bk,
                validFrom: $stateParams.selectedDate,
                type:tool.name
            };
            newparts.push(newpart);
            $scope.gardenparts.push(newpart);
        });

        // Update position/dimentions existing Garden
        $scope.$on('updateGarden',function() {
            $scope.updateParts();
            var garden = $scope.garden;
            garden.validFrom =  $scope.selectedDate;
						var leankeepers=[];
						var keepers = garden.keepers;
						for(var i=0;i<keepers.length;i++){
							console.log('garden.keepers[i]'+keepers[i]._id);
							leankeepers.push(keepers[i]._id);
						}
						garden.keepers = leankeepers;
						console.log('garden.keepers'+garden.keepers);
						Gardens.update(garden,function() {
                $location.path('gardens/' + garden.bk + '/' + $scope.selectedDate);

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        });

        // Update existing Gardenparts
        $scope.updateParts = function() {
            var garden = $scope.garden ;
            newparts._id = garden._id;
            var gardenparts = $scope.gardenparts;
            //convert position to absolute for all gardenparts
            for(var i=0;i<gardenparts.length;i++){
                gardenparts[i].elemtop = parseInt(gardenparts[i].elemtop) + parseInt(garden.elemtop);
                gardenparts[i].elemleft = parseInt(gardenparts[i].elemleft) + parseInt(garden.elemleft);
            }

            Gardenpart.createParts({bk:garden.bk,selectedDate:$stateParams.selectedDate},newparts);

            //Update the modified parts
            //Filter new parts
            var filtered = gardenparts.filter(function(x) { return newparts.indexOf(x) < 0; });
            var modified = [];
            for(i=0;i<filtered.length;i++){
                if(filtered[i].modified){
                    delete  filtered[i].modified;
                    modified.push(filtered[i]);
                }
            }
            if(modified.length>0)
                Gardenpart.updateParts({bk:garden.bk,selectedDate:$stateParams.selectedDate},modified);

						Gardenpart.deleteParts({bk:garden.bk,selectedDate:$stateParams.selectedDate},delparts);
            $location.path('gardens/' + garden.bk + '/' + $stateParams.selectedDate);
        };


        $scope.findOneVersion = function() {
            $scope.garden = Gardenversions.get({
                gardenId: $stateParams.gardenId,
                selectedDate: $stateParams.selectedDate
            });

            Gardendata.setGarden($scope.garden);

            $scope.garden.$promise.then(function(garden) {
                var gardenparts = garden.gardenparts;
                //convert position to relative for all gardenparts
                var gardentop = parseInt(garden.elemtop);
                var gardenleft =parseInt(garden.elemleft);
                for(var i=0;i<gardenparts.length;i++){
                    gardenparts[i].elemtop = parseInt(gardenparts[i].elemtop) - gardentop;
                    gardenparts[i].elemleft = parseInt(gardenparts[i].elemleft) - gardenleft;
                }
                $scope.gardenparts = gardenparts;
                $scope.$emit('gardenpartsLoaded');
            });
        };

        $scope.findVersions = function() {
            $scope.gardens = Gardenversions.query({selectedDate: null});
        };
	}
]);

(function () {
  'use strict';

  angular
    .module('gardens')
    .controller('GardensListController', GardensListController);

  GardensListController.$inject = ['GardensService'];

  function GardensListController(GardensService) {
    var vm = this;

    vm.gardens = GardensService.query();
  }
})();

'use strict';

angular.module('gardens').controller('ToolboxController', ['$scope', '$rootScope', 'GardensService',
	function($scope, $rootScope, Gardens) {

        $scope.addNewGardenpart = function (tool){
            $rootScope.$broadcast('addNewGardenpart',tool);

        };

        var garden = $scope.garden;
		$scope.toolboxInit = function() {
            // Some initialization


        };
	}
]);

'use strict';
/*global $:false */
angular.module('gardens').directive('calendar', [
	function() {
        return {
            require: 'ngModel',
            link: function (scope, el, attr, ngModel) {
							console.log('calendar ');
                el.datepicker({
                    dateFormat: 'yy-mm-dd',
                    onSelect: function (dateText) {
                        //console.log('attr: '+ JSON.stringify(attr));
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                            scope.setDate(dateText);

                            console.log('attr: '+ attr.calendar);
                            var mode = attr.calendar;

                            //In view reload met tuin op die datum
                            if( mode === 'view' || mode === 'edit' ) {
                                scope.findOne();
                            }
                        });
                    }
                });
            }
        };
	}
]);

'use strict';
/*global $:false */

angular.module('gardens').directive('dragtool', [
  function() {
    //var draggableConfig = {animate: true };
    var draggableConfig = {};
    return {
      restrict: 'A',
      link: function postLink(scope, elem, attrs) {
        var css = { 'z-index': '1040','left': window.innerWidth/2, 'width': '220px'};
        elem.css(css);
        elem.draggable(draggableConfig);
        elem.addClass('col-md-'+attrs.dragtool+' panel panel-default dragtool');
        elem.prepend('            <div class="panel-heading glyphicon glyphicon-move" style="width: 100%"/>');
      }
    };
  }
]);

'use strict';
/*global $:false */

angular.module('gardens').directive('garden', [
	function() {
		var resizableConfig= {grid: [ 5, 5 ],handles: 'all', containment: 'parent'};
		var draggableConfig = {animate: true,grid: [ 5, 5 ], containment: 'parent' };
		return {
			restrict: 'A',
			link: function postLink(scope, elem, attrs) {
				var mode = attrs.garden;
				if(mode === 'create'){
					elem.addClass('creategarden');
					elem.draggable(draggableConfig);
					scope.updateCoordinates(50,50,250,350);
					elem.on('drag', function(evt,ui){
						scope.updateCoordinates(ui.position.top,ui.position.left,elem.height(),elem.width());
						scope.$apply();
					});
				}else{
					scope.$on('gardenpartsLoaded', function(){
						var topmin = Number.MAX_VALUE;
						var offsettop = Number.MIN_VALUE;
						var leftmin = Number.MAX_VALUE;
						var offsetleft = Number.MIN_VALUE;
						angular.forEach(scope.gardenparts, function(gardenpart,key){
							if(topmin>gardenpart.elemtop){
								topmin=gardenpart.elemtop;
							}
							if(leftmin>gardenpart.elemleft){
								leftmin=gardenpart.elemleft;
							}
							var partoffsettop = gardenpart.elemtop+gardenpart.elemheight;
							if(offsettop<partoffsettop){
								offsettop=partoffsettop;
							}
							var partoffsetleft = gardenpart.elemleft+gardenpart.elemwidth;
							if(offsetleft<partoffsetleft){
								offsetleft=partoffsetleft;
							}
						});
						scope.minHeight = offsettop - topmin;
						scope.minWidth = offsetleft - leftmin;
						scope.initialMinHeight = offsettop - topmin;
						scope.initialMinWidth = offsetleft - leftmin;
						scope.initialTop = scope.garden.elemtop;
						scope.initialLeft = scope.garden.elemleft;
						scope.initialHeight = scope.garden.elemheight;
						scope.initialWidth = scope.garden.elemwidth;

						elem.resizable('option', 'minHeight', scope.minHeight );
						elem.resizable('option', 'minWidth', scope.minWidth );
					});
				}

				elem.resizable(resizableConfig);
				elem.on('resize', function(evt,ui){
					var cancel = scope.updateCoordinates(ui.position.top,ui.position.left,ui.size.height,ui.size.width);

					if(mode !== 'create'){
						elem.resizable('option', 'minHeight', scope.minHeight );
						elem.resizable('option', 'minWidth', scope.minWidth );
						ui.size.height = scope.garden.elemheight;
						ui.position.top = scope.garden.elemtop;
						ui.size.width = scope.garden.elemwidth;
						ui.position.left = scope.garden.elemleft;
					}
					scope.$apply();
				});
			}
		};
	}
]);

'use strict';
/*global $:false */
var getCoordinates = function(elem){
    var el = $(elem);
    var co = {};
    co.top = el.css('top').replace('px','');
    co.left = el.css('left').replace('px','');
    co.height = el.css('height').replace('px','');
    co.width = el.css('width').replace('px','');
    return co;
};


angular.module('gardens').directive('gardenpart', ['$timeout',
	function($timeout) {
        return {
            restrict: 'A',
            link: function postLink(scope, elem, attrs) {

                scope.popoverEvent = function() {
                    $timeout(function() {
                        elem.trigger('customEvent');
                    }, 0);
                };

                var updateCoordinates = function(){
                    var co = getCoordinates(elem);
                    scope.update(co.top, co.left, co.width, co.height);
                    //elem.qtip('option', 'content.text', scope.tooltiptext);
                    scope.$apply();
                };

                var resizeStop = function(){
                    scope.gardenpart.modified = true;
                    console.log('modified:' + JSON.stringify(scope.gardenpart));
                    updateCoordinates();
                };

                elem.addClass(scope.gardenpart.type);

                if(attrs.gardenpart === 'layout'){
                    var resizableConfig= {containment: '#garden', autoHide: false, snap: true, snapmode: 'outer',stop: resizeStop, resize: updateCoordinates};
                    switch(scope.gardenpart.type){
                        case 'hweg':
                            resizableConfig.minHeight=25;
                            resizableConfig.maxHeight=60;
                            resizableConfig.handles = 'n,s,e,w';
                            break;
                        case'vweg':
                            resizableConfig.minWidth=25;
                            resizableConfig.maxWidth=60;
                            resizableConfig.handles = 'n,s,e,w';
                            break;
                        case 'akke':
                            resizableConfig.minHeight=50;
                            resizableConfig.minWidth=50;
                            resizableConfig.handles = 'n,s,e,w';
                            break;
                        case 'vbed':
                            resizableConfig.minWidth=60;
                            resizableConfig.maxWidth=120;
                            resizableConfig.handles = 'n,s,e,w';
                            break;
                        case 'hbed':
                            resizableConfig.minHeight=60;
                            resizableConfig.maxHeight=120;
                            resizableConfig.handles = 'n,s,w,e';
                            break;
                        default:
                            console.log('you shouldnt get here default case in switch gardenpart directive' + JSON.stringify(scope.gardenpart));
                    }
                    elem.resizable(resizableConfig);
                    elem.droppable();

                    // Enkel bij nieuwe gardenparts
                    if(typeof scope.gardenpart.bk === 'undefined'){
                        switch(scope.gardenpart.type){
                            case 'hweg':
                                scope.update(0,0,150,30);
                                break;
                            case'vweg':
                                scope.update(0,0,30,150);
                                break;
                            case 'akke':
                                scope.update(0,0,50,50);
                                break;
                            case 'vbed':
                                scope.update(0,0,100,200);
                                break;
                            case 'hbed':
                                scope.update(0,0,200,100);
                                break;
                            default:
                                console.log('you shouldnt get here default case in switch gardenpart directive' + JSON.stringify(scope.gardenpart));
                        }
                        var draggableConfig = {animate: true,grid: [ 1, 1 ], containment: 'parent', revert: 'valid', snap: '.gardenpart ', snapmode: 'outer'};
                        draggableConfig.drag = updateCoordinates;
                        elem.draggable(draggableConfig);
                    }
                }
            }
        };
	}
]);
'use strict';

angular.module('gardens').directive('myenter', [
	function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				element.bind('keydown keypress', function (event) {
						if(event.which === 13) {
								scope.$apply(function (){
										scope.addKeeper();
								});

								event.preventDefault();
						}
				});
			}
		};
	}
]);

'use strict';

angular.module('gardens').directive('rulers', ['$timeout', '$window',
function($timeout,$window) {
	return {
		template:
		'<div class="ruler corner"></div>'+
		'<div class="ruler vRule1" ><div ng-repeat="vbox in vboxes" class="vRuleBox">{{vbox}}</div></div>' +
		'<div class="ruler vRule" ></div>' +
		'<div class="ruler hRule1" ><div ng-repeat="hbox in hboxes" class="hRuleBox">{{hbox}}</div></div>' +
		'<div class="ruler hRule"/>',
		restrict: 'E',
		link: function postLink(scope, element, attrs) {
			var parent = element.parent();
			//	parent.height(700);

			var render = function(zoom){
				if(typeof zoom === 'undefined')
				zoom=1;
				parent.height($window.innerHeight);
				scope.hboxes = [];
				scope.vboxes = [];
				$timeout(function () {
					scope.nrhbox = $window.innerWidth/50;
					scope.nrvbox = $window.innerHeight/50;

					for(var i=0; i<scope.nrhbox;i++){
						scope.hboxes.push(Math.round((i*50)/zoom));
					}
					for(i=0; i<scope.nrvbox;i++){
						scope.vboxes.push(Math.round((i*50)/zoom));
					}
					parent.css('background','url("/modules/gardens/client/img/il-grid-trans.png") repeat scroll left top #fff');
				});

			};


			scope.$on('$destroy', function(event){
				console.log('destroying the background from rulers destroy'+event);
				//  if(typeof scope.planting === 'undefined')
				parent.css('background','');
			});
			// var w = angular.element($window);
			//  w.bind('resize',render);
			render();
			scope.$on('updatedZoom',function(event,zoom){
				render(zoom);
			});
		}
	};
}
]);

'use strict';
/*global $:false */
angular.module('gardens').directive('toolbox', [
	function() {
		return {
			restrict: 'A',
            link: function postLink(scope, elem, attrs) {
                var toolClicked = function(tool)
                {
                    return function() {
                        scope.$apply(function() {
                           scope.addNewGardenpart(tool);
                        });
                    };
                };
                elem.draggable();

                 var hweg = $('#hweg')
                 .addClass(
                 'ui-toolbox-hweg '+
                 'ui-widget-content '
                 );
                hweg.name = 'hweg';
                hweg.bind('click', toolClicked(hweg));

                var vweg = $('#vweg')
                    .addClass(
                        'ui-toolbox-vweg '+
                        'ui-widget-content '
                );
                vweg.name = 'vweg';
                vweg.bind('click', toolClicked(vweg));

                 var hbed = $('#hbed')
                 .addClass(
                 'ui-toolbox-hbed '+
                 'ui-widget-content '
                 );
                hbed.name = 'hbed';
                hbed.bind('click', toolClicked(hbed));

                var vbed = $('#vbed')
                    .addClass(
                        'ui-toolbox-vbed '+
                        'ui-widget-content '
                );
                vbed.name = 'vbed';
                vbed.bind('click', toolClicked(vbed));


                var akke = $('#akke')
                .addClass(
                    'ui-toolbox-akke ' +
                    'ui-widget-content '
                );
                akke.name = 'akke';
                akke.bind('click', toolClicked(akke));
            }
		};
	}
]);

'use strict';

angular.module('gardens').factory('Gardendata', [
	function() {
		var garden;
		var error;

		return {
			setGarden: function(arg) {
				garden = arg;
			},
			getGarden: function(){
				return garden;
			},
			setError: function(arg) {
				error = arg;
			},
			getError: function(){
				return error;
			}
		};
	}
]);

(function () {
  'use strict';

  angular
  .module('gardens.services')
  .factory('GardenpartsService', GardenpartsService);

  GardenpartsService.$inject = ['$resource','$stateParams'];

  function GardenpartsService($resource,$stateParams) {
    return $resource('api/gardenparts/:bk/:selectedDate', {
      bk: '@bk',
      selectedDate: $stateParams.selectedDate
    }, {
      createParts: {
        method: 'PUT',
        isArray : true
      },
      updateParts: {
        method: 'POST',
        isArray : true
      },
      deleteParts: {
        method: 'POST',
        url: '/gardenparts/delete/:bk/:selectedDate',
        isArray: true
      }
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('gardens.services')
    .factory('GardensService', GardensService);

  GardensService.$inject = ['$resource','$stateParams'];

  function GardensService($resource,$stateParams) {
    return $resource('api/gardens/:bk/:selectedDate', {
      bk: '@bk',
      selectedDate: $stateParams.selectedDate
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

'use strict';

//Gardenversions service used to communicate Gardenversions REST endpoints
angular.module('gardens').factory('Gardenversions', ['$resource','$stateParams',
	function($resource, $stateParams) {
        if($stateParams.selectedDate === undefined){
            var today = new Date();
            $stateParams.selectedDate = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
        }
        console.log('gardenversions service statedate: ' + $stateParams.selectedDate);
		return $resource('/api/gardenversions/:gardenId/:selectedDate', { gardenId: '@_id',selectedDate: '@selectedDate'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

(function () {
  'use strict';

  angular
    .module('plantfamilies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Plant families',
      state: 'plantfamilies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'plantfamilies', {
      title: 'List plant families',
      state: 'plantfamilies.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'plantfamilies', {
      title: 'Create plant family',
      state: 'plantfamilies.create',
      roles: ['user']
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('plantfamilies.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('plantfamilies', {
        abstract: true,
        url: '/plantfamilies',
        template: '<ui-view/>'
      })
      .state('plantfamilies.list', {
        url: '',
        templateUrl: 'modules/plant-families/client/views/list-plant-families.client.view.html',
        controller: 'PlantFamiliesListController',
        controllerAs: 'vm'
      })
      .state('plantfamilies.create', {
        url: '/create',
        templateUrl: 'modules/plant-families/client/views/form-plant-family.client.view.html',
        controller: 'PlantFamiliesController',
        controllerAs: 'vm',
        resolve: {
          plantFamilyResolve: newPlantFamily
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('plantfamilies.edit', {
        url: '/:plantFamilyId/edit',
        templateUrl: 'modules/plant-families/client/views/form-plant-family.client.view.html',
        controller: 'PlantFamiliesController',
        controllerAs: 'vm',
        resolve: {
          plantFamilyResolve: getPlantFamily
        },
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('plantfamilies.view', {
        url: '/:plantFamilyId',
        templateUrl: 'modules/plant-families/client/views/view-plant-family.client.view.html',
        controller: 'PlantFamiliesController',
        controllerAs: 'vm',
        resolve: {
          plantFamilyResolve: getPlantFamily
        }
      });
  }

  getPlantFamily.$inject = ['$stateParams', 'PlantFamilyService'];

  function getPlantFamily($stateParams, PlantFamilyService) {
    return PlantFamilyService.get({
      plantFamilyId: $stateParams.plantFamilyId
    }).$promise;
  }

  newPlantFamily.$inject = ['PlantFamilyService'];

  function newPlantFamily(PlantFamilyService) {
    return new PlantFamilyService();
  }
})();

(function () {
  'use strict';

  angular
    .module('plantfamilies')
    .controller('PlantFamiliesListController', PlantFamiliesListController);

  PlantFamiliesListController.$inject = ['PlantFamilyService'];

  function PlantFamiliesListController(PlantFamilyService) {
    var vm = this;

    vm.plantfamilies = PlantFamilyService.query();
  }
})();

(function () {
  'use strict';

  angular
    .module('plantfamilies')
    .controller('PlantFamiliesController', PlantFamiliesController);

  PlantFamiliesController.$inject = ['$scope', '$state', 'plantFamilyResolve', 'Authentication'];

  function PlantFamiliesController($scope, $state, plantfamily, Authentication) {
    var vm = this;

    vm.plantfamily = plantfamily;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.plantfamily.$remove($state.go('plantfamilies.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.plantFamilyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.plantfamily._id) {
        vm.plantfamily.$update(successCallback, errorCallback);
      } else {
        vm.plantfamily.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('plantfamilies.view', {
          plantFamilyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('plantfamilies.services')
    .factory('PlantFamilyService', PlantFamilyService);

  PlantFamilyService.$inject = ['$resource'];

  function PlantFamilyService($resource) {
    return $resource('api/plant-families/:plantFamilyId', {
      plantFamilyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

'use strict';

// Configuring the Users module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
