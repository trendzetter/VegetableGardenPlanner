(function () {
  'use strict';

  describe('Friends Route Tests', function () {
    // Initialize global variables
    var $scope,
      FriendsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FriendsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FriendsService = _FriendsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.friends');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/friends');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.friends.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/friends/client/views/admin/list-friends.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FriendsAdminController,
          mockFriend;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.friends.create');
          $templateCache.put('/modules/friends/client/views/admin/form-friend.client.view.html', '');

          // Create mock friend
          mockFriend = new FriendsService();

          // Initialize Controller
          FriendsAdminController = $controller('FriendsAdminController as vm', {
            $scope: $scope,
            friendResolve: mockFriend
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.friendResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/friends/create');
        }));

        it('should attach an friend to the controller scope', function () {
          expect($scope.vm.friend._id).toBe(mockFriend._id);
          expect($scope.vm.friend._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/friends/client/views/admin/form-friend.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FriendsAdminController,
          mockFriend;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.friends.edit');
          $templateCache.put('/modules/friends/client/views/admin/form-friend.client.view.html', '');

          // Create mock friend
          mockFriend = new FriendsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Friend about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          FriendsAdminController = $controller('FriendsAdminController as vm', {
            $scope: $scope,
            friendResolve: mockFriend
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:friendId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.friendResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            friendId: 1
          })).toEqual('/admin/friends/1/edit');
        }));

        it('should attach an friend to the controller scope', function () {
          expect($scope.vm.friend._id).toBe(mockFriend._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/friends/client/views/admin/form-friend.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
