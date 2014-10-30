var artistModule = angular.module('album', ['ui.router', 'services', 'ui.bootstrap']);

artistModule.config(function($stateProvider) {
    $stateProvider.state('private.album', {
        url: "/album/:albumId",
        templateUrl: "/partials/private.album.html",
        controller: 'albumController'
    });
    $stateProvider.state("private.album.addToPlaylist", {
        url: "/addToPlaylist",
        onEnter: function($stateParams, $state, $modal) {
            $modal.open({
                templateUrl: "/partials/private.album.addToPlaylist.html"
            });
        }
    });
});


artistModule.controller('albumController', function($scope, $state, $stateParams, APIService, $modal) {
    $scope.tracks = [];
    APIService.getAlbum($stateParams.albumId).success(function(data, status, headers, config){
        $scope.album = data.results[0];
        $scope.album.releaseDate = $scope.album.releaseDate.substr(0, 10);
    });

    APIService.getAlbumsTracks($stateParams.albumId).success(function(data, status, headers, config){
        for(var i = 0; i < data.results.length; i++){
            data.results[i].time = new Time(data.results[i].trackTimeMillis);
        }
        $scope.tracks = data.results;
    });

    $scope.showModal = function() {
        $state.go('private.album.addToPlaylist');
    }
});

