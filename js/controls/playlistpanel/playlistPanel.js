function PlaylistPanel(playlist){
    this.name = playlist.name;
    this.owner = playlist.owner;
    this.tracks = playlist.tracks;
    this.settings = {
        canEdit: false,
        canDelete: false,
        canPlay: false
    };

    this.canBeEdited = function() {
        this.settings.canEdit = true;
        return this;
    }

    this.canBeDeleted = function() {
        this.settings.canDelete = true;
        return this;
    }

    this.canBePlayed = function() {
        this.settings.canPlay = true;
        return this;
    }

}