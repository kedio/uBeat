angular.module('playlistPanelModule', ['ui.router', 'services'])

.directive('playlistPanel', function(){
    return{
        restrict: 'E',
        scope:{
            playlist: '='
        },
        templateUrl: '/js/controls/playlistpanel/playlistPanel.html'
    };
})

.factory('playlistPanelFactory', function(){
    return {
        create: function(playlist, deleteCallBack){
            return new PlaylistPanel(playlist, deleteCallBack);
        }
    }
})

.controller('playlistPanelController', function($scope, $modal, APIService, AudioService){

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
            playlist.delete();
        });
    }

});
