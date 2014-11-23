/**
 * Created by dominique on 22/11/14.
 */
function ArtistList(name, artists){
    this.name = name;
    this.artists = artists;
    this.height ={
        height: Math.ceil(artists.length /2)* 122 + 80 + "px"
    }
}