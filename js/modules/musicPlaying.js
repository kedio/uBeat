var audio = angular.module('Audio', ['ngAudio']);

audio.factory('AudioService', function(ngAudio){
    return{
        currentlyPlayingTrack: null,

        registerTrack : function(track){
            track.audioObject = ngAudio.load(track.previewUrl);
        },

        playTrack: function(track){
            if(this.currentlyPlayingTrack == track){
                track.audioObject.play();
            }
            else{
                if(this.currentlyPlayingTrack !== null){
                    this.stopTrack(this.currentlyPlayingTrack);
                }
                track.audioObject.play();
                this.currentlyPlayingTrack = track;

            }
        },

        pauseTrack: function(track){
            if(this.currentlyPlayingTrack == track){
                track.audioObject.pause();
            }
        },

        stopTrack: function(track){
            if(this.currentlyPlayingTrack == track){
                track.audioObject.stop();
                this.currentlyPlayingTrack = null;
            }
        }
    }


})