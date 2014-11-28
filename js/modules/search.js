var searchModule = angular.module('search', ['ui.router', 'services','albumlistModule','tracklist','artistlist']);

searchModule.config(function($stateProvider) {
    $stateProvider.state('private.search', {
        url: "/search",
        templateUrl: "/partials/private.search.html",
        controller: 'searchController',
        params: ['q', 'type']
    });

});

searchModule.controller('searchController', function($scope, $stateParams, $location, APIService, tracklistFactory, albumlistFactory, artistlistFactory) {
console.log($stateParams);



    resetResults();
    $scope.searchOptions = ['all', 'artists', 'albums', 'tracks'];
    $scope.selectedOption = 'all';
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
                        case 'track': $scope.resultTracks.push(result);
                            break;
                        case 'collection': $scope.resultAlbums.push(result);
                            break;
                        case 'artist': $scope.resultArtists.push(result);
                            break;
                    }
                }

            });
            $scope.tracklist = tracklistFactory.create('Tracks',$scope.resultTracks)
                .showListName().showName().showArtist().showAlbum().showLength().allowPlay().allowAddToPlaylist();
            $scope.albumlist = albumlistFactory.create('Albums', $scope.resultAlbums).showName();
            $scope.artistlist = artistlistFactory.create('Artists', $scope.resultArtists);
        })
    };

    function resetResults(){
        $scope.resultArtists = [];
        $scope.resultAlbums = [];
        $scope.resultTracks = [];
    }

    if($location.search().type) {
        $scope.selectedOption = $location.search().type;
    }
    if($location.search().q) {
        $scope.queryString = $location.search().q;
        $scope.search();
    }
    $scope.$watch('queryString', function(queryString) {
        $location.search('q', queryString);
    });

    $scope.$watch('selectedOption', function(selectedOption) {
        $location.search('type', selectedOption);
    });
});



