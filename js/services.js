var services = angular.module('services', ['ngCookies', 'ui.bootstrap']);
var api = {
    //base: "http://localhost:3000"
    base: "https://ubeat.herokuapp.com"
};

services.factory('APIService', function($http, $modal) {
    var showErrorModal = function(errorMessage){
        $modal.open({
            templateUrl: "/partials/private.errorModal.html",
            controller: function($scope, $modalInstance){
                $scope.message = errorMessage;
                $scope.ok = function(){
                    $modalInstance.close();
                }
            }
        });
    };

    return {

        getArtist: function(id) {
            return $http.get(api.base + '/artists/' + id).error(function() {
                showErrorModal('Could not get artist.');
            });
        },

        getAlbum:function(id){
            return $http.get(api.base + '/albums/' + id).error(function() {
                showErrorModal('Could not get album.');
            });
        },

        getAlbumsForArtist: function(artistId){
            return $http.get(api.base + '/artists/' + artistId + '/albums/').error(function() {
                showErrorModal('Could not get albums.');
            });
        },

        getAlbumsTracks: function(albumId){
            return $http.get(api.base + '/albums/' + albumId + '/tracks').error(function() {
                showErrorModal('Could not get album tracks');
            });
        },

        getPlaylists: function(){
            return $http.get(api.base + '/playlists').error(function() {
                showErrorModal('Could not get playlists.');
            })
        },

        getPlaylistDetails:function(playlistId){
            return $http.get(api.base + '/playlists/' + playlistId).error(function() {
                showErrorModal('Could not get playlist details.');
            });
        },

        getUserInfo: function(userId){
            return $http.get(api.base + '/users/' + userId).error(function() {
                showErrorModal('Could not get user profile.');
            });
        },

        followUser: function(userId){
            return $http.post(api.base + '/follow', {id: userId}).error(function() {
                showErrorModal('Could not follow user.');
            });
        },

        unfollowUser: function(userId){
            return $http.delete(api.base + '/follow/' + userId).error(function() {
                showErrorModal('Could not unfollow user.');
            });
        },

        deleteTrackFromPlayList:function(playlistId, trackId){
            return $http.delete(api.base + '/playlists/' + playlistId + '/tracks/' + trackId).error(function() {
                showErrorModal('Could not delete track from playlist.');
            });
        },

        createPlaylist: function(playlistName, email) {
            return $http.post(api.base + '/playlists', {name: playlistName, owner: email}).error(function() {
                showErrorModal('Could not create the playlist.');
            });
        },

        deletePlaylist: function(id) {
            return $http.delete(api.base + '/playlists/' + id).error(function() {
                showErrorModal('Could not delete the playlist.');
            });
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
            return $http.put(api.base + '/playlists/' + playlistId, {name: playlistName, tracks: extendedTracks}).error(function() {
                showErrorModal('Could not update the playlist');
            });
        },

        logout: function() {
            return $http.get(api.base + '/logout');
        },

        signup: function(name, email, password) {
            return $http.post(api.base + '/signup', {name: name, email: email, password: password});
        },

        search: function(queryString, option){
            if(option == 'all'){
                return $http.get(api.base + '/search?q=' + queryString +'&limit=20').error(function() {
                    showErrorModal('Could not complete search.');
                });
            }
            else{
                return $http.get(api.base +'/search/' + option + '?q=' + queryString).error(function() {
                    showErrorModal('Could not complete search.');
                });
            }
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

    this.logout = function() {
        this.setAuthenticated(false);
        auth.user = null;
        $cookieStore.remove('user');
        $rootScope.user = null;
    };
    this.setAuthenticated = function(value) {
        auth.isAuthenticated = value;
    };

    this.setUser = function(user) {
        $cookieStore.put('user', user);
        $rootScope.user = user;
        auth.user = user;
    };

    this.getToken = function() {
        if(auth.user){
            return auth.user.token;
        }
    };


});

services.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        // Add token to outgoing request
        request: function (config) {
            if(config.url.has('http://developer.echonest.com/')){
                return config;
            }
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

