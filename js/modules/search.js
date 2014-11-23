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

searchModule.controller('searchController', function($scope, $rootScope, $state, $stateParams, APIService, tracklistFactory, albumlistFactory) {

    resetResults();
    $scope.searchOptions = ['all', 'artists', 'albums', 'tracks'];
    $scope.selectedOption = 'all';
    $scope.tracklist = tracklistFactory.create([]);
    $scope.albumlist = albumlistFactory.create([]);
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
            $scope.tracklist = tracklistFactory.create(resultTracks)
                .showName().showArtist().showAlbum().showLength().allowPlay().allowAddToPlaylist();
            $scope.albumlist = albumlistFactory.create($scope.resultAlbums);
        })
    }

    function resetResults(){
        $scope.resultArtists = [];
        $scope.resultAlbums = [];
        resultTracks = [];
    }
});



