angular.module('artistlist', [])

.directive('artistlist', function(){
        return{
            restrict: 'E',
            scope:{
                artistlist: '=data'
            },
            templateUrl: '/js/controls/artistlist/artistlist.html'
        };
    })

.factory('artistlistFactory', function(){
        return {
            create: function(name, artists){
                return new ArtistList(name, artists);
            }
        }
    });