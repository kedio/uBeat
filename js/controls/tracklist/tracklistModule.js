/**
 * Created by dominique on 23/11/14.
 */
angular.module('tracklist',[])

.directive('tracklist', function(){
        return{
            restrict: 'E',
            scope:{
                tracklist: '=data'
            },
            templateUrl: '/js/controls/tracklist/tracklist.html'
        };
    })

.factory('tracklistFactory', function(AudioService){
    return {
        create: function(tracks){
            for(var i = 0 ; i < tracks.length; i++){
                AudioService.registerTrack(tracks[i]);
                tracks[i].time = new Time(tracks[i].trackTimeMillis);
            }
            return new Tracklist(tracks);
        }
    }
});