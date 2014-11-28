function Tracklist(tracks){
    this.name = name;
    this.tracks = tracks;
    this.settings = {
        showTrackNo: false,
        showName: false,
        showArtist: false,
        showAlbum: false,
        showLength: false,
        allowPlay: false,
        allowAddToPlaylist: false,
        allowDelete: false
    };

    this.showTrackNo = function(){
        this.settings.showTrackNo = true;
        return this;
    };

    this.showName = function(){
        this.settings.showName = true;
        return this;
    };

    this.showArtist = function(){
        this.settings.showArtist = true;
        return this;
    };

    this.showAlbum = function(){
        this.settings.showAlbum = true;
        return this;
    };

    this.showLength = function(){
        this.settings.showLength = true;
        return this;
    };

    this.allowPlay = function(){
        this.settings.allowPlay = true;
        return this;
    };

    this.allowAddToPlaylist = function(){
        this.settings.allowAddToPlaylist = true;
        return this;
    };

    this.allowDelete = function(){
        this.settings.allowDelete = true;
        return this;
    }


    this.getTracks = function(){
        return this.tracks;
    }
}