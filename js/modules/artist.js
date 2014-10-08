var artistModule = angular.module('artist', ['ui.router', 'services']);

artistModule.config(function($stateProvider) {
    $stateProvider.state('private.artist', {
        url: "/artist/:artistId",
        templateUrl: "/partials/private.artist.html",
        controller: 'artistController'
    });
});


artistModule.controller('artistController', function($scope, $state,$stateParams, APIService) {
    $scope.relatedAlbums = [];
    APIService.getArtist($stateParams.artistId).success(function(data, status, headers, config){
        $scope.artist = data.results[0];

        APIService.getAlbumsForArtist($scope.artist.artistName).success(function(data, status, headers, config){
            $scope.relatedAlbums = data.results;
        });
    });
});