'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/ng-cropper/dist/ngCropper.all.min.css',
        'public/lib/ng-img-crop/compile/minified/ng-img-crop.css',
        // endbower
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
      ],
      js: [
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/jquery-ui/jquery-ui.min.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.min.js',
        'public/lib/angular-bootstrap-contextmenu/contextMenu.js',
        'public/lib/cropper/dist/cropper.min.js',
        'public/lib/ng-cropper/dist/ngCropper.all.min.js',
        'public/lib/dragon-drop/dist/dragon-drop.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/ng-img-crop/compile/minified/ng-img-crop.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-translate/angular-translate.min.js',
        'public/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        'public/lib/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
        'public/lib/angular-translate-storage-local/angular-translate-storage-local.min.js'
        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
