angular.module('albumlistModule', [])

.directive('albumlist', function(){
        return{
            restrict: 'E',
            scope:{
                albums: '='
            },
            templateUrl: '/js/controls/albumlist/albums-list.html'
        };
    })