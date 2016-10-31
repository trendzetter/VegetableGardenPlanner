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
          mainstate = $state.get('admin.tasks');
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
          liststate = $state.get('admin.tasks.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('modules/tasks/client/views/admin/list-tasks.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TasksAdminController,
          mockTask;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.tasks.create');
          $templateCache.put('modules/tasks/client/views/admin/form-task.client.view.html', '');

          // Create mock task
          mockTask = new TasksService();

          // Initialize Controller
          TasksAdminController = $controller('TasksAdminController as vm', {
            $scope: $scope,
            taskResolve: mockTask
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.taskResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/tasks/create');
        }));

        it('should attach an task to the controller scope', function () {
          expect($scope.vm.task._id).toBe(mockTask._id);
          expect($scope.vm.task._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/tasks/client/views/admin/form-task.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TasksAdminController,
          mockTask;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.tasks.edit');
          $templateCache.put('modules/tasks/client/views/admin/form-task.client.view.html', '');

          // Create mock task
          mockTask = new TasksService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Task about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          TasksAdminController = $controller('TasksAdminController as vm', {
            $scope: $scope,
            taskResolve: mockTask
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:taskId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.taskResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            taskId: 1
          })).toEqual('/admin/tasks/1/edit');
        }));

        it('should attach an task to the controller scope', function () {
          expect($scope.vm.task._id).toBe(mockTask._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/tasks/client/views/admin/form-task.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
