var playlistsModule = angular.module('playlists', ['ui.router', 'services', 'ngAudio', 'Audio']);

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
            controller: 'playlistCreateController',
            resolve:  {
                myPlaylists: function() {
                    return $scope.myPlaylists ;
                }
            }
        })
    };

    $scope.deletePlaylist = function(playlist) {
        APIService.deletePlaylist(playlist.id).success(function() {
            //console.log(typeof $scope.playlists)
            //$scope.playlists = $scope.playlists.exclude(playlist);
        });
    }
});

playlistsModule.controller('playlistDetailsController', function($scope, $state, $stateParams, APIService, ngAudio, AudioService){
    function updateTrackList(){
        APIService.getPlaylistDetails($stateParams.playlistId).success(function(data, status, headers, config){
            angular.forEach(data.tracks, function(track){
                track.time = new Time(track.trackTimeMillis);
                AudioService.registerTrack(track);
                //track.audioObject = ngAudio.load(track.previewUrl);
                //track.status = 'not-playing';
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
        if(track.status == 'playing'){
            AudioService.pauseTrack(track);
        }
        else{
            AudioService.playTrack(track);
        }
    }
});

playlistsModule.controller('playlistCreateController', function($scope, $rootScope, $modalInstance, APIService, myPlaylists){
    $scope.playlist = {};
    $scope.confirm = function() {
        APIService.createPlaylist($scope.playlist.name, $rootScope.user.email).success(function(data) {
            console.log(data);
            myPlaylists.push(data);
            $modalInstance.close();
        }).error(function(error) {
            console.log('error while adding playlist', error);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
});


