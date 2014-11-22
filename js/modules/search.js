/**
 * Created by dominique on 22/11/14.
 */
var searchModule = angular.module('search', ['ui.router', 'services']);

searchModule.config(function($stateProvider) {
    $stateProvider.state('private.search', {
        url: "/search",
        templateUrl: "/partials/private.search.html",
        controller: 'searchController'
    });

});

searchModule.controller('searchController', function($scope, $rootScope, $state, $stateParams, APIService, tracklistFactory) {

    resetResults();
    $scope.searchOptions = ['all', 'artists', 'albums', 'tracks', 'users'];
    $scope.selectedOption = 'all';
    $scope.tracklist = tracklistFactory.createTrackList([]);
    $scope.search = function(){
        console.log($scope.queryString + ': ' + $scope.selectedOption);
        APIService.search($scope.queryString, $scope.selectedOption).success(function(data){
            resetResults();
            angular.forEach(data.results, function(result){
                if(result.wrapperType == undefined){
                    $scope.resultUsers.push(result);
                }
                else{
                    switch(result.wrapperType){
                        case 'track': resultTracks.push(result);
                            break;
                        case 'collection': $scope.resultAlbums.push(result);
                            break;
                        case 'artist': $scope.resultArtists.push(result);
                            break;
                    }
                }

            })
            $scope.tracklist = tracklistFactory.createTrackList(resultTracks).disableShowTrackNo();
        })
    }

    function resetResults(){
        $scope.resultArtists = [];
        $scope.resultAlbums = [];
        resultTracks = [];
        $scope.resultUsers = [];
    }
});



