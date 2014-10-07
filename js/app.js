var ubeatcore = angular.module('ubeatcore', ['ui.router', 'artist']);

ubeatcore.controller('mainController', function($scope, $state) {
    $scope.state = $state;
});


ubeatcore.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider.state('album', {
        url: "/album",
        templateUrl: "/partials/album.html"
    });
});

