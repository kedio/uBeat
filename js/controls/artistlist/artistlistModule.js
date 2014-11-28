angular.module('artistlist', ['echonest'])

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

.controller('artistListController', function($scope, echonest){
    $scope.$watch('artistlist', function(newArtistlist){
        if(newArtistlist == undefined){
            return;
        }
        angular.forEach(newArtistlist.artists, function(artist){
            if(artist.artistImage == undefined){
                echonest.getArtistImage(artist.artistName, function(artistImage){
                   artist.artistImage = artistImage;
                })
            }
        })
    })
});