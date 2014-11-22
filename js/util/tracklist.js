/**
 * Created by dominique on 22/11/14.
 */
function Tracklist(tracks){
    this.tracks = tracks;
    this.settings = {
        addToPlaylist: true,
        showTrackNo: true
    };

    this.disableAddToPlaylist = function(){
        this.settings.addToPlaylist = false;
        return this;
    };

    this.disableShowTrackNo = function(){
        this.settings.showTrackNo = false;
        return this;
    };

    this.getTracks = function(){
        return this.tracks;
    }
}