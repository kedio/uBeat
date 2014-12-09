angular.module('artistlist', ['echonest'])

.directive('artistlist', function(){
        return{
            restrict: 'E',
            scope:{
                artists: '=',
                ordered: '='
            },
            templateUrl: '/js/controls/artistlist/artistlist.html',
            controller: 'artistListController'
        };
    })

.factory('artistlistFactory', function(){
        return {
            create: function(artists){
                return new ArtistList(artists);
            }
        }
    })

.controller('artistListController', function($scope, echonest){
    $scope.$watch('artists', function(newArtists){
        if(newArtists == undefined){
            return;
        };

        angular.forEach(newArtists, function(artist){
            if(artist.artistImage == undefined){
                echonest.getArtistImage(artist.artistName, function(artistImage){
                   artist.artistImage = artistImage;
                })
            }
        })
    })
});