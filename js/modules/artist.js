var artistModule = angular.module('artist', ['ui.router', 'services']);

artistModule.config(function($stateProvider) {
    $stateProvider.state('artist', {
        url: "/artist",
        templateUrl: "partials/artist.html",
        controller: 'artistController'
    });
});


artistModule.controller('artistController', function($scope, $state, APIService) {
    $scope.relatedAlbums = [];
    APIService.getArtist(136975).success(function(data, status, headers, config){
        $scope.artist = data.results[0];

        APIService.getAlbumsForArtist($scope.artist.artistName).success(function(data, status, headers, config){
            $scope.relatedAlbums = data.results;
        })
    })
});