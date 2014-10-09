var playlistsModule = angular.module('playlists', ['ui.router', 'services']);

playlistsModule.config(function($stateProvider) {
    $stateProvider.state('private.playlists', {
        url: "/playlists",
        templateUrl: "/partials/private.playlists.html",
        controller: 'playlistsController'
    });
});


playlistsModule.controller('playlistsController', function($scope, $state, $stateParams, APIService) {
    APIService.getPlaylists().success(function (data) {
        console.log(data);
        $scope.playlists = data;
    });
});

