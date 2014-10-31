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

playlistsModule.controller('playlistDetailsController', function($scope, $state, $stateParams, APIService, ngAudio){
    function updateTrackList(){
        APIService.getPlaylistDetails($stateParams.playlistId).success(function(data, status, headers, config){
            angular.forEach(data.tracks, function(track){
                track.time = new Time(track.trackTimeMillis);
                track.audioObject = ngAudio.load(track.previewUrl);
                track.status = 'not-playing';
            });
            $scope.playlist = data;
        });
    }
   updateTrackList();
    $scope.currentPlayingTrack = null;

    $scope.deleteTrack = function(track){
        track.audioObject.stop();
        APIService.deleteTrackFromPlayList($stateParams.playlistId, track._id).success(function() {
            updateTrackList();
        });
    }

    $scope.playTrack = function(track){
        if($scope.currentPlayingTrack == track){
            if(track.status == 'not-playing'){
                startTrack(track)
                $scope.currentPlayingTrack = track;
            }
            else{
                track.audioObject.pause();
                track.status = 'not-playing';
            }
        }
        else{
            angular.forEach($scope.playlist.tracks, function(trackToStop){
                if(trackToStop.status== 'playing'){
                    trackToStop.audioObject.stop();
                    trackToStop.status = 'not-playing';
                }
            })
            startTrack(track);
            $scope.currentPlayingTrack = track;
        }

    }

    function startTrack(track){
        track.audioObject.play();
        track.status = 'playing';
    }
});

