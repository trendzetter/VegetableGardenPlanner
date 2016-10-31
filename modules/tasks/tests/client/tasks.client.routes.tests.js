(function () {
  'use strict';

  describe('Tasks Route Tests', function () {
    // Initialize global variables
    var $scope,
      TasksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TasksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TasksService = _TasksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tasks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tasks');
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
          liststate = $state.get('tasks.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('modules/tasks/client/views/list-tasks.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TasksController,
          mockTask;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tasks.view');
          $templateCache.put('modules/tasks/client/views/view-task.client.view.html', '');

          // create mock task
          mockTask = new TasksService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Task about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TasksController = $controller('TasksController as vm', {
            $scope: $scope,
            taskResolve: mockTask
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:taskId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.taskResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            taskId: 1
          })).toEqual('/tasks/1');
        }));

        it('should attach an task to the controller scope', function () {
          expect($scope.vm.task._id).toBe(mockTask._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/tasks/client/views/view-task.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('tasks.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('tasks/');
          $rootScope.$digest();

          expect($location.path()).toBe('/tasks');
          expect($state.current.templateUrl).toBe('modules/tasks/client/views/list-tasks.client.view.html');
        }));
      });
    });
  });
}());
