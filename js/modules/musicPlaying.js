var audio = angular.module('Audio', ['ngAudio']);

audio.factory('AudioService', function(ngAudio, $interval){
    return{
        currentlyPlayingTrack: null,
        currentlyPlayingPlaylist: null,
        currentlyPlayingTrackID: 0,
        playNextTrackCallback: null,

        registerTrack : function(track){
            track.audioObject = ngAudio.load(track.previewUrl);
        },

        playTrack: function(track){
            if(this.currentlyPlayingTrack == track){
                track.audioObject.play();
            }
            else{
                if(this.currentlyPlayingTrack !== null){
                    this.stopPlaylist();
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
        },

        playPlaylist: function(playlist){
            if(this.currentlyPlayingPlaylist){
                this.stopPlaylist();
            }

            var self = this;
            angular.forEach(playlist.tracks, function(track){
                track.time = new Time(track.trackTimeMillis);
                self.registerTrack(track);
            });
            this.currentlyPlayingPlaylist = playlist.tracks;
            this.currentlyPlayingTrackID = 0;
            this.playTrack(this.currentlyPlayingPlaylist[this.currentlyPlayingTrackID]);
            this.playNextTrackCallback = $interval(function(){
                self.playNextTrack(self)
                }, 1000);
        },

        playNextTrack: function(serviceRef){
            if(serviceRef.currentlyPlayingTrack.audioObject.progress == 1){
                serviceRef.currentlyPlayingTrackID++;
                if(serviceRef.currentlyPlayingTrackID < serviceRef.currentlyPlayingPlaylist.length){
                    serviceRef.stopTrack(serviceRef.currentlyPlayingTrack);
                    serviceRef.playTrack(serviceRef.currentlyPlayingPlaylist[this.currentlyPlayingTrackID])
                }
                else{
                    serviceRef.stopPlaylist();
                }
            }
        },

        stopPlaylist: function(){
            this.stopTrack(this.currentlyPlayingTrack);
            this.currentlyPlayingPlaylist = null;
            $interval.cancel(this.playNextTrackCallback);
            this.playNextTrackCallback = null;
        }
    }
})