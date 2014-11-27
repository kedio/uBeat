angular.module('tracklist',['ui.router','services'])

.directive('tracklist', function(){
        return{
            restrict: 'E',
            scope:{
                tracklist: '=data'
            },
            templateUrl: '/js/controls/tracklist/tracklist.html'
        };
    })

.factory('tracklistFactory', function(AudioService){
    return {
        create: function(name, tracks){
            for(var i = 0 ; i < tracks.length; i++){
                AudioService.registerTrack(tracks[i]);
                tracks[i].time = new Time(tracks[i].trackTimeMillis);
            }
            return new Tracklist(name, tracks);
        }
    }
})

.controller('tracklistController', function($scope, $state, $stateParams, AudioService, $modal, APIService){

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
    };

    $scope.deleteTrack = function(track){
        track.audioObject.stop();
        APIService.deleteTrackFromPlayList($stateParams.playlistId, track.trackId).success(function() {
            $scope.tracklist.tracks.remove(track);
        });
    }

});