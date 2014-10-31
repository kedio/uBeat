var audio = angular.module('Audio', ['ngAudio']);

audio.factory('AudioService', function(ngAudio){
    return{
        currentlyPlayingTrack: null,

        registerTrack : function(track){
            track.audioObject = ngAudio.load(track.previewUrl);
            track.status = 'not-playing';
        },

        playTrack: function(track){
            if(this.currentlyPlayingTrack == track){
                track.audioObject.play();
                track.status = 'playing';
            }
            else{
                if(this.currentlyPlayingTrack !== null){
                    this.stopTrack(this.currentlyPlayingTrack);
                }
                track.audioObject.play();
                track.status = 'playing';
                this.currentlyPlayingTrack = track;

            }
        },

        pauseTrack: function(track){
            if(this.currentlyPlayingTrack == track){
                track.audioObject.pause();
                track.status = 'not-playing'
            }
        },

        stopTrack: function(track){
            if(this.currentlyPlayingTrack == track){
                track.audioObject.stop();
                track.status = 'not-playing';
                this.currentlyPlayingTrack = null;
            }
        }
    }


})