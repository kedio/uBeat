angular.module('albumlistModule', [])

.directive('albumlist', function(){
        return{
            restrict: 'E',
            scope:{
                albumlist: '=data'
            },
            templateUrl: '/js/controls/albumlist/albums-list.html'
        };
    })

.factory('albumlistFactory', function(){
        return  {
            create: function(albums){
                return new Albumlist(albums)
            }
        };
    });