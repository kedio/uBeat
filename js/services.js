var services = angular.module('services', []);
services.factory('APIService', function($http) {
    return {
        getArtist: function(id) {
            return $http.get('/api/artist/' + id);
        }
    }
});
