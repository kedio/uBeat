var artistModule = angular.module('artist', ['ui.router', 'services','albumlistModule', 'echonest','biography']);

artistModule.config(function($stateProvider) {
    $stateProvider.state('private.artist', {
        url: "/artist/:artistId",
        templateUrl: "/partials/private.artist.html",
        controller: 'artistController'
    });
});


artistModule.controller('artistController', function($scope, $state,$stateParams, APIService, artistlistFactory, echonest) {
    $scope.activeTab = 'albums'
    $scope.relatedAlbums = [];
    APIService.getArtist($stateParams.artistId).success(function(data, status, headers, config){
        $scope.artist = data.results[0];

        APIService.getAlbumsForArtist($stateParams.artistId).success(function(data, status, headers, config){
            $scope.artistAlbums = data.results;

            echonest.getArtistImage($scope.artist.artistName, function(artistImage){
                if(artistImage == undefined){
                    $scope.artist.artistImage = $scope.albumList.albums[0].artworkUrl100;
                }
                else{
                    $scope.artist.artistImage = artistImage;
                }

            })

        });
        echonest.getArtistBiography($scope.artist.artistName, function(biography){
            $scope.artist.biography = biography;
        })

        echonest.getSimilar($scope.artist.artistName, function(similarArtists){
            $scope.similarArtistsList = similarArtists;
        })
    });

    $scope.activateTab = function(tab){
            $scope.activeTab = tab;
    }
});