var services = angular.module('services', ['ngCookies']);
var api = {
    base: "http://localhost:3000"
    //base: "https://ubeat.herokuapp.com"
};

services.factory('APIService', function($http) {
    return {
        getArtist: function(id) {
            return $http.get(api.base + '/artists/' + id);
        },

        getAlbum:function(id){
            return $http.get(api.base + '/albums/' + id);
        },

        getAlbumsForArtist: function(artistId){
            return $http.get(api.base + '/artists/' + artistId + '/albums/')
        },

        getAlbumsTracks: function(albumId){
            return $http.get(api.base + '/albums/' + albumId + '/tracks');
        },

        getPlaylists: function(){
            return $http.get(api.base + '/playlists')
        },

        getPlaylistDetails:function(playlistId){
            return $http.get(api.base + '/playlists/' + playlistId);
        },

        deleteTrackFromPlayList:function(playlistId, playlistTrackId){
            return $http.delete(api.base + '/playlists/' + playlistId + '/tracks/' + playlistTrackId);
        },

        createPlaylist: function(playlistName, email) {
            return $http.post(api.base + '/playlists', {name: playlistName, owner: email});
        },

        deletePlaylist: function(id) {
            return $http.delete(api.base + '/playlists/' + id);
        },

        login: function(email, password) {
            return $http.post(api.base + '/login', {email: email, password: password});
        },

        updatePlaylist: function(playlistId, playlistName, trackList) {
            var extendedTracks =[];
            for(var i = 0; i < trackList.length; i++){
                var extendedTrack = angular.extend({}, trackList[i]);
                extendedTrack.audioObject = null;
                extendedTracks.push(extendedTrack);
            }
           /* angular.forEach(trackList, function(track){

            });*/
           // return $http.post(api.base + '/login', {email: email, password: password});
            return $http.put(api.base + '/playlists/' + playlistId, {name: playlistName, tracks: extendedTracks});
        },

        logout: function() {
            return $http.get(api.base + '/logout');
        }

    }
});

services.service('AuthenticationService', function($cookieStore, $rootScope) {
    var auth = {
        isAuthenticated: false,
        user: $cookieStore.get('user') || {}
    };
    $rootScope.user = auth.user;

    this.isAuthenticated = function()  {
        return auth.isAuthenticated;
    };

    this.setAuthenticated = function(value) {
        auth.isAuthenticated = value;
    };

    this.getUser = function() {
        return auth.user;
    };

    this.setUser = function(user) {
        $cookieStore.put('user', user);
        $rootScope.user = user;
        auth.user = user;
    };

    this.getToken = function() {
        return auth.user.token;
    };


});

services.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        // Add token to outgoing request
        request: function (config) {
            config.headers = config.headers || {};
            if (AuthenticationService.getToken()) {
                config.headers.Authorization = AuthenticationService.getToken();
            }
            return config;
        },
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
        // Set AuthenticationService.isAuthenticated to true if 200 received
        response: function (response) {
            if (response != null && response.status == 200 && AuthenticationService.getToken() && !AuthenticationService.isAuthenticated()) {
                AuthenticationService.setAuthenticated(true);
            }
            return response || $q.when(response);
        },
        // Revoke authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && (AuthenticationService.getToken() || AuthenticationService.isAuthenticated())) {
                AuthenticationService.setAuthenticated(false);
                $location.path('/login');
            }

            return $q.reject(rejection);
        }
    };
});

services.factory('CollectionService', function(){
    return {
        add: function(collection, item){
            collection.push(item);
        },

        remove: function(collection, item){
            var index = collection.indexOf(item);
            if(index > -1){
                collection.splice(index, 1);
            }
        }
    }
})

