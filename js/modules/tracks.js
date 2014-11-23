/**
 * Created by dominique on 22/11/14.
 */
var tracksModule = angular.module('tracks', ['ui.bootstrap','Audio','album']);

tracksModule.controller('tracklistController', function($scope,AudioService, $modal){

    $scope.toggleTrack = function(track){
        if(track.audioObject.paused == false){
            AudioService.pauseTrack(track);
        }
        else{
            AudioService.playTrack(track);
        }
    };

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