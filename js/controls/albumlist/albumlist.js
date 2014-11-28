
function Albumlist(name, albums){
    this.name = name;
    this.albums = albums;
    this.settings = {
        showName: false
    }

    this.showName = function(){
        this.settings.showName = true;
        return this;
    };
}