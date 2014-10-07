var services = angular.module('services', []);

services.factory('APIService', function($http) {
    $http.defaults.headers.common.Authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDMyZjk0YmQ5YzNlYzk1M2Q0Mzc2OTYiLCJleHAiOjE0MTI3MzE0Mjg1MDJ9.ZsMgiqg53HUkzwidJZ8dgeNjLjhtsXA21DfwsF8Ia_4';
    return {
        getArtist: function(id) {
            return $http.get('http://localhost:3000/artists/' + id);
        },

        getAlbumsForArtist: function(artistName){
            return $http.get('http://localhost:3000/search/albums?q='+ artistName);
        }
    }
});
