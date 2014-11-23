/**
 * Created by dominique on 22/11/14.
 */
function ArtistList(artists){
    this.artists = artists;
    this.height ={
        height: Math.ceil(artists.length /2)* 120 + 35 + "px"
    }
}