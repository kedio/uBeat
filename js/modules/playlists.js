var playlistsModule = angular.module('playlists', ['ui.router', 'services', 'ngAudio', 'Audio','tracklist']);

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

playlistsModule.controller('playlistsController', function($scope, $rootScope, $state, $stateParams, APIService, $modal, AudioService) {

    var loadingPlaylistsList = function(){
        APIService.getPlaylists().success(function (data) {
            $scope.myPlaylists = data.findAll(function(playlist) {
                if(playlist.owner) {
                    return playlist.owner.email === $rootScope.user.email;
                }
                return false;
            });
            $scope.otherPlaylists = data;
        });
    };

    loadingPlaylistsList();

    $scope.createNewPlaylist = function() {
        $modal.open({
            templateUrl: "/partials/private.playlists.createNewPlaylist.html",
            controller: 'playlistCreateController',
            resolve:  {
                myPlaylists: function() {
                    return $scope.myPlaylists ;
                },
                otherPlaylists: function(){
                    return $scope.otherPlaylists;
                }
            }
        })
    };

    $scope.renamePlaylist = function(playlist) {
        $modal.open({
            templateUrl: "/partials/private.playlists.renamePlaylist.html",
            controller: 'playlistRenameController',
            resolve:  {
                playlist: function() {
                    return playlist;
                }
            }
        })
    };

    $scope.deletePlaylist = function(playlist) {
        APIService.deletePlaylist(playlist.id).success(function() {
            $scope.myPlaylists.remove(playlist);
            $scope.otherPlaylists.remove(playlist);
        });
    }

    $scope.togglePlaylist = function(playlist) {
        if(this.isPlaylistPlaying(playlist)){
            AudioService.stopPlaylist();
        }
        else{
            if(playlist.tracks.length){
                AudioService.playPlaylist(playlist);
            }
        }
    }

    $scope.isPlaylistPlaying = function(playlist){
        var isPlaying = false;
        angular.forEach(playlist.tracks, function(track){
            if("audioObject" in track){
                if(!track.audioObject.paused){
                    isPlaying = true;
                }
            }
        });
        return isPlaying;
    }
});

playlistsModule.controller('playlistDetailsController', function($scope, $state, $stateParams, APIService, ngAudio, AudioService, tracklistFactory){
    function updateTrackList(){
        APIService.getPlaylistDetails($stateParams.playlistId).success(function(data, status, headers, config){
            angular.forEach(data.tracks, function(track){
                track.time = new Time(track.trackTimeMillis);
                AudioService.registerTrack(track);
            });
            $scope.playlist = data;
            $scope.tracklist = tracklistFactory.create(data.tracks)
                .showName().showArtist().showAlbum().showLength().allowPlay().allowDelete();
        });
    }
   updateTrackList();
    $scope.currentPlayingTrack = null;
});

playlistsModule.controller('playlistCreateController', function($scope, $rootScope, $modalInstance, APIService, myPlaylists, otherPlaylists){
    $scope.playlist = {};
    $scope.confirm = function() {
        APIService.createPlaylist($scope.playlist.name, $rootScope.user.email).success(function(data) {
            console.log(data);
            myPlaylists.push(data);
            otherPlaylists.push(data);
            $modalInstance.close();
        }).error(function(error) {
            console.log('error while adding playlist', error);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
});

playlistsModule.controller('playlistRenameController', function($scope, $rootScope, $modalInstance, APIService, playlist){
    $scope.playlist = playlist;
    $scope.confirm = function() {
        APIService.updatePlaylist($scope.playlist.id, $scope.playlist.name, $scope.playlist.tracks).success(function() {
            $modalInstance.close();
        }).error(function(error) {
            console.log('error while renaming playlist', error);
        });
    };

    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
});



