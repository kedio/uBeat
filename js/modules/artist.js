var artistModule = angular.module('artist', ['ui.router', 'services','albumlistModule']);

artistModule.config(function($stateProvider) {
    $stateProvider.state('private.artist', {
        url: "/artist/:artistId",
        templateUrl: "/partials/private.artist.html",
        controller: 'artistController'
    });
});


artistModule.controller('artistController', function($scope, $state,$stateParams, APIService, albumlistFactory) {
    $scope.relatedAlbums = [];
    APIService.getArtist($stateParams.artistId).success(function(data, status, headers, config){
        $scope.artist = data.results[0];

        APIService.getAlbumsForArtist($stateParams.artistId).success(function(data, status, headers, config){
            $scope.albumList = albumlistFactory.create('Related Albums',data.results);
        });
    });
});