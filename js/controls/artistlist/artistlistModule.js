/**
 * Created by dominique on 23/11/14.
 */
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
            create: function(artists){
                return new ArtistList(artists);
            }
        }
    })