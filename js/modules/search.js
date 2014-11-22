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

searchModule.controller('searchController', function($scope, $rootScope, $state, $stateParams, APIService, $modal, AudioService) {

    resetResults();
    $scope.searchOptions = ['all', 'artists', 'albums', 'tracks', 'users'];
    $scope.selectedOption = 'all';

    $scope.search = function(){
        console.log($scope.queryString + ': ' + $scope.selectedOption);
        APIService.search($scope.queryString, $scope.selectedOption).success(function(data){
            resetResults();
            /*for(var i = 0; i < data.results.length; i++){
                if(data.results[i].wrapperType == undefined){
                    $scope.resultUsers.push(result);
                }
                else{
                    switch(data.results[i].wrapperType){
                        case 'track': $scope.resultTracks.push(data.results[i]);
                            break;
                        case 'collection': $scope.resultAlbums.push(data.results[i]);
                            break;
                        case 'artist': $scope.resultArtists.push(data.results[i]);
                            break;
                    }
                }
            }*/
            angular.forEach(data.results, function(result){
                if(result.wrapperType == undefined){
                    $scope.resultUsers.push(result);
                }
                else{
                    switch(result.wrapperType){
                        case 'track': $scope.tracks.push(result);
                            break;
                        case 'collection': $scope.resultAlbums.push(result);
                            break;
                        case 'artist': $scope.resultArtists.push(result);
                            break;
                    }
                }

            })
        })
    }

    function resetResults(){
        $scope.resultArtists = [];
        $scope.resultAlbums = [];
        $scope.tracks = [];
        $scope.resultUsers = [];
    }
});



