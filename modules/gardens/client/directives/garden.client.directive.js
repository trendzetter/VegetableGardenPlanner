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
