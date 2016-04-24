(function () {
  'use strict';

  angular
    .module('cultivation-plans')
    .controller('CultivationStepController', CultivationStepController);

  CultivationStepController.$inject = ['$scope', 'FileUploader', 'Cropper', '$timeout'];

  function CultivationStepController($scope, FileUploader, Cropper, $timeout) {
    /**
     * Object is used to pass options to initalize a cropper.
     * More on options - https://github.com/fengyuanchen/cropper#options
     */
    var file,
      data;
    $scope.options = {
      maximize: true,
      aspectRatio: $scope.iconRatio,
        // aspectRatio: 16 / 9,
      crop: function(dataNew) {
        data = dataNew;
        $scope.scale($scope.iconScale);
            // $scope.scale(128);
      }
    };
 /*  $scope.$on('changeVariety', function(){
        var variety = JSON.parse($scope.vm.cultivationPlan.variety);
        console.log('variety.cmBetweenRow / variety.cmInRow:' + $scope.vm.cultivationPlan.variety._id + $scope.vm.cultivationPlan.variety);

    })*/

    /**
     * When there is a cropped icon to show encode it to base64 string and
     * use as a source for an icon element.
     */
    $scope.preview = function() {
      if (!file || !data) return;
      Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
        ($scope.step || ($scope.step = {})).icon = dataUrl;
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
          ($scope.step || ($scope.step = {})).icon = dataUrl;
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
      $timeout(hideCropper);
      Cropper.encode((file = fileItem._file)).then(function(dataUrl) {
        $scope.dataUrl = dataUrl;
        $timeout(showCropper); // wait for $digest to set icon's src
      });
    };
  }
}());
