var artistModule = angular.module('artist', ['ui.router', 'services']);

artistModule.config(function($stateProvider) {
    $stateProvider.state('artist', {
        url: "/artist",
        templateUrl: "partials/artist.html",
        controller: 'artistController'
    });
});


artistModule.controller('artistController', function($scope, $state, APIService) {
    /*APIService.getArtist('wer').success(function(data) {
     $scope.relatedAlbums = data.albums
     });
     */
    $scope.relatedAlbums = [];

    $scope.relatedAlbums = [
        {
            title: "1",
            artist: "The Beatles",
            artworkUrl: "http://a1.mzstatic.com/us/r30/Features/85/fe/95/dj.kfrgxzbp.100x100-75.jpg"
        },
        {
            title: "1",
            artist: "The Beatles",
            artworkUrl: "http://a1.mzstatic.com/us/r30/Features/85/fe/95/dj.kfrgxzbp.100x100-75.jpg"
        },
        {
            title: "1",
            artist: "The Beatles",
            artworkUrl: "http://a1.mzstatic.com/us/r30/Features/85/fe/95/dj.kfrgxzbp.100x100-75.jpg"
        }
    ];





});