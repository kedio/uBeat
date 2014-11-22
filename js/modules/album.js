var artistModule = angular.module('album', ['ui.router', 'services', 'ui.bootstrap', 'Audio','tracks']);

artistModule.config(function($stateProvider) {
    $stateProvider.state('private.album', {
        url: "/album/:albumId",
        templateUrl: "/partials/private.album.html",
        controller: 'albumController'
    });
});


artistModule.controller('albumController', function($scope, $state, $stateParams, APIService,AudioService, $modal,tracklistFactory) {
    $scope.tracklist = [];
    APIService.getAlbum($stateParams.albumId).success(function(data, status, headers, config){
        $scope.album = data.results[0];
        $scope.album.releaseDate = $scope.album.releaseDate.substr(0, 10);
    });

    APIService.getAlbumsTracks($stateParams.albumId).success(function(data, status, headers, config){

        $scope.tracklist = tracklistFactory.create(data.results)
            .showTrackNo().showName().showLength().allowPlay().allowAddToPlaylist();
    });

    $scope.toggleTrack = function(track){
        if(track.audioObject.paused == false){
            AudioService.pauseTrack(track);
        }
        else{
            AudioService.playTrack(track);
        }
    }

    $scope.addSelectedToPlaylist = function() {
        $scope.tracksToAdd = [];
        angular.forEach($scope.tracklist.tracks, function(track) {
            if (track.selected == true){
                $scope.tracksToAdd.push(track);
            }
        });
        $modal.open({
            templateUrl: "/partials/private.album.addToPlaylist.html",
            controller:"addToPlaylistController",
            resolve:{
                tracks: function() {
                    return $scope.tracksToAdd;
                }
            }
        });
    };

    $scope.toggleSelection = function(selected) {
        angular.forEach($scope.tracklist.tracks, function(track) {
            track.selected = selected;
        });
    }
});


artistModule.controller('addToPlaylistController', function($scope, $rootScope, $modalInstance, $state, APIService, tracks) {
    $scope.playlists = [];
    $scope.selectedPlaylist = {};

    APIService.getPlaylists().success(function (data) {
        $scope.playlists = data;
    })

    $scope.confirm = function() {

        console.log($scope.selectedPlaylist.playlist.id);
        console.log($scope.selectedPlaylist);
        $scope.selectedPlaylist.playlist.tracks = $scope.selectedPlaylist.playlist.tracks.concat(tracks);

        APIService.updatePlaylist($scope.selectedPlaylist.playlist.id,$scope.selectedPlaylist.playlist.name, $scope.selectedPlaylist.playlist.tracks);

        $modalInstance.close();
    }

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }
});
