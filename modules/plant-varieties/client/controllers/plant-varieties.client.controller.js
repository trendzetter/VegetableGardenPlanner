(function() {
  'use strict';

  angular
    .module('plant-varieties')
    .controller('PlantVarietiesController', PlantVarietiesController);

  PlantVarietiesController.$inject = ['$scope', '$state', '$timeout', '$window', 'plantVarietyResolve', 'Authentication', 'CropsService', 'FileUploader', 'Cropper'];

  function PlantVarietiesController($scope, $state, $timeout, $window, plantvariety, Authentication, CropsService, FileUploader, Cropper) {
    var vm = this;
    vm.plantvariety = plantvariety;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.crops = CropsService.query();

    /**
     * Object is used to pass options to initalize a cropper.
     * More on options - https://github.com/fengyuanchen/cropper#options
     */
    var file,
      data;
    $scope.options = {
      maximize: true,
      aspectRatio: 1 / 1,
      // aspectRatio: 16 / 9,
      crop: function(dataNew) {
        data = dataNew;
        // $scope.scale(200);
        $scope.scale(128);
      }
    };

    /**
     * When there is a cropped image to show encode it to base64 string and
     * use as a source for an image element.
     */
    $scope.preview = function() {
      if (!file || !data) return;
      Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
        (vm.plantvariety || (vm.plantvariety = {})).image = dataUrl;
      });
    };

    $scope.scale = function(width) {
      Cropper.crop(file, data)
        .then(function(blob) {
          return Cropper.scale(blob, {
            width: width
          });
        })
        .then(Cropper.encode).then(function(dataUrl) {
          (vm.plantvariety || (vm.plantvariety = {})).image = dataUrl;
        });
    };

    /**
     * Showing (initializing) and hiding (destroying) of a cropper are started by
     * events. The scope of the `ng-cropper` directive is derived from the scope of
     * the controller. When initializing the `ng-cropper` directive adds two handlers
     * listening to events passed by `ng-show` & `ng-hide` attributes.
     * To show or hide a cropper `$broadcast` a proper event.
     */
    $scope.showEvent = 'show';
    $scope.hideEvent = 'hide';

    function showCropper() {
      $scope.$broadcast($scope.showEvent);
    }

    function hideCropper() {
      $scope.$broadcast($scope.hideEvent);
    }

    // Create file uploader instance
    $scope.uploader = new FileUploader();

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function(fileItem) {
      // $timeout(hideCropper);
      Cropper.encode((file = fileItem._file)).then(function(dataUrl) {
        $scope.dataUrl = dataUrl;
        $timeout(showCropper); // wait for $digest to set image's src
      });
    };

    // Save PlantVariety
    function save(isValid) {
      if (!isValid) {
              console.log('save!');
        $scope.$broadcast('show-errors-check-validity', 'vm.form.plantvarietyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.plantvariety._id) {
        vm.plantvariety.$update(successCallback, errorCallback);
      } else {
        vm.plantvariety.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('plant-varieties.view', {
          plantVarietyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
