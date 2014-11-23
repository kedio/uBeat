/**
 * Created by dominique on 23/11/14.
 */
/**
 * Created by dominique on 22/11/14.
 */
function Albumlist(name, albums){
    this.name = name;
    this.albums = albums;
    this.height = {
        height: Math.ceil(albums.length /2)* 122 + 80 + "px"
    };
}