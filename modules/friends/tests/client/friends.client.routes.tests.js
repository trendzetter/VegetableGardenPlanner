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
          mainstate = $state.get('friends');
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
          liststate = $state.get('friends.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/friends/client/views/list-friends.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FriendsController,
          mockFriend;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('friends.view');
          $templateCache.put('/modules/friends/client/views/view-friend.client.view.html', '');

          // create mock friend
          mockFriend = new FriendsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Friend about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          FriendsController = $controller('FriendsController as vm', {
            $scope: $scope,
            friendResolve: mockFriend
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:friendId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.friendResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            friendId: 1
          })).toEqual('/friends/1');
        }));

        it('should attach an friend to the controller scope', function () {
          expect($scope.vm.friend._id).toBe(mockFriend._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/friends/client/views/view-friend.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/friends/client/views/list-friends.client.view.html', '');

          $state.go('friends.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('friends/');
          $rootScope.$digest();

          expect($location.path()).toBe('/friends');
          expect($state.current.templateUrl).toBe('/modules/friends/client/views/list-friends.client.view.html');
        }));
      });
    });
  });
}());
