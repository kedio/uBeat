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


playlistsModule.controller('playlistsController', function($scope, $rootScope, $state, $stateParams, APIService, $modal) {
    APIService.getPlaylists().success(function (data) {
        $scope.myPlaylists = data.findAll(function(playlist) {
            if(playlist.owner) {
                return playlist.owner.email === $rootScope.user.email;
            }
            return false;
        });
        $scope.otherPlaylists = data;
    });
    $scope.createNewPlaylist = function() {
        $modal.open({
            templateUrl: "/partials/private.playlists.createNewPlaylist.html",
            controller: 'playlistCreateController'
        })
    };

});

playlistsModule.controller('playlistDetailsController', function($scope, $state, $stateParams, APIService){
    function updateTrackList(){
        APIService.getPlaylistDetails($stateParams.playlistId).success(function(data, status, headers, config){
            for(var i = 0; i < data.tracks.length; i++){
                data.tracks[i].time = new Time(data.tracks[i].trackTimeMillis);
            }
            $scope.playlist = data;
        });
    }
   updateTrackList();

    $scope.deleteTrack = function(playlistTrackId){
        APIService.deleteTrackFromPlayList($stateParams.playlistId, playlistTrackId).success(function() {
            updateTrackList();
        });
    }
});

playlistsModule.controller('playlistCreateController', function($scope, $rootScope, $modalInstance, APIService){
    $scope.playlist = {};
    $scope.confirm = function() {
        APIService.createPlaylist($scope.playlistName, $rootScope.user.email).success(function() {
            $modalInstance.close();
        }).error(function(error) {
            console.log('error while adding playlist', error);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
});


