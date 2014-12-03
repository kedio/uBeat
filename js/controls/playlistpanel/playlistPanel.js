function PlaylistPanel(playlist, deleteCallBack){
    this.name = playlist.name;
    this.id = playlist.id;
    this.owner = playlist.owner;
    this.tracks = playlist.tracks;
    this.deleteCallBack = deleteCallBack;
    this.settings = {
        canEdit: false,
        canDelete: false,
        canPlay: false
    };

    this.delete = function(){
        this.deleteCallBack();
    }

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