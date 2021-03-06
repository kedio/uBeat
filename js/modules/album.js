var albumModule = angular.module('album', ['ui.router', 'services', 'ui.bootstrap', 'Audio','tracklist']);


albumModule.config(function($stateProvider) {
    $stateProvider.state('private.album', {
        url: "/album/:albumId",
        templateUrl: "/partials/private.album.html",
        controller: 'albumController'
    });
});


albumModule.controller('albumController', function($scope, $state, $stateParams, APIService,AudioService, $modal,tracklistFactory) {
    $scope.tracklist = [];
    APIService.getAlbum($stateParams.albumId).success(function(data, status, headers, config){
        $scope.album = data.results[0];
        $scope.album.releaseDate = $scope.album.releaseDate.substr(0, 10);
    });

    APIService.getAlbumsTracks($stateParams.albumId).success(function(data, status, headers, config){

        $scope.tracklist = tracklistFactory.create(data.results)
            .showTrackNo().showName().showLength().allowPlay().allowAddToPlaylist();
    });
});


albumModule.controller('addToPlaylistController', function($scope, $rootScope, $modalInstance, $state, APIService, tracks, $timeout) {
    $scope.playlists = [];
    $scope.selectedPlaylist = {};

    $scope.playlistsLoaded = false;
    APIService.getPlaylists().success(function (data) {
        $scope.playlists = data.findAll(function(playlist) {
            if(playlist.owner) {
                return playlist.owner.email === $rootScope.user.email;
            }
            return false;
        });
        $scope.playlistsLoaded = true;
    });


    $scope.confirm = function() {

        console.log($scope.selectedPlaylist.playlist.id);
        console.log($scope.selectedPlaylist);
        $scope.selectedPlaylist.playlist.tracks = $scope.selectedPlaylist.playlist.tracks.concat(tracks);

        APIService.updatePlaylist($scope.selectedPlaylist.playlist.id,$scope.selectedPlaylist.playlist.name, $scope.selectedPlaylist.playlist.tracks).success(function() {
            $scope.completedMessage = 'Successfully added!';
            $timeout(function() {
                $modalInstance.close();
            }, 1200);
        }).error(function() {
            $modalInstance.close();
        });


    };

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }
});
