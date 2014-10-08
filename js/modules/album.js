/**
 * Created by dominique on 06/10/14.
 */
var artistModule = angular.module('album', ['ui.router', 'services']);

artistModule.config(function($stateProvider) {
    $stateProvider.state('album', {
        url: "/album/:albumId",
        templateUrl: "/partials/album.html",
        controller: 'albumController'
    });
});


artistModule.controller('albumController', function($scope, $state, $stateParams, APIService) {
    $scope.tracks = [];
    APIService.getAlbum($stateParams.albumId).success(function(data, status, headers, config){
        $scope.album = data.results[0];
        $scope.album.releaseDate = $scope.album.releaseDate.substr(0, 10);
    });

    APIService.getAlbumsTracks($stateParams.albumId).success(function(data, status, headers, config){
        data.results.splice(0,1);
        for(var i = 0; i < data.results.length; i++){
            data.results[i].time = new Time(data.results[i].trackTimeMillis);
        }
        $scope.tracks = data.results;
    })
});

