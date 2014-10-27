var playlistsModule = angular.module('playlists', ['ui.router', 'services']);

playlistsModule.config(function($stateProvider) {
    $stateProvider.state('private.playlists', {
        url: "/playlists",
        templateUrl: "/partials/private.playlists.html",
        controller: 'playlistsController'
    });

    $stateProvider.state('private.playlists-details', {
        url: '/playlists/:playlistId',
        templateUrl: '/partials/private.playlists.details.html',
        controller: 'playlistDetailsController'
    });
});


playlistsModule.controller('playlistsController', function($scope, $state, $stateParams, APIService) {
    APIService.getPlaylists().success(function (data) {
        console.log(data);
        $scope.playlists = data;
    });
});

playlistsModule.controller('playlistDetailsController', function($scope, $state, $stateParams, APIService){
   APIService.getPlaylistDetails($stateParams.playlistId).success(function(data, status, headers, config){
       for(var i = 0; i < data.tracks.length; i++){
           data.tracks[i].time = new Time(data.tracks[i].trackTimeMillis);
       }

        $scope.playlist = data;
    });

    $scope.deleteTrack = function(){

    }
});

