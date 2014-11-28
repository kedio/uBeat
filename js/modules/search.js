var searchModule = angular.module('search', ['ui.router', 'services','albumlistModule','tracklist','artistlist','userslist']);

searchModule.config(function($stateProvider) {
    $stateProvider.state('private.search', {
        url: "/search",
        templateUrl: "/partials/private.search.html",
        controller: 'searchController',
        params: ['q', 'type']
    });

});

searchModule.controller('searchController', function($scope, $stateParams, $location, APIService, tracklistFactory, albumlistFactory, artistlistFactory) {

    function searchMusic(){
        APIService.search($scope.queryString, $scope.selectedOption).success(function(data){
            resetMusic();
            for(var i = 0; i < data.results.length; i++){
                switch(data.results[i].wrapperType){
                    case 'track': $scope.resultTracks.push(data.results[i]);
                        break;
                    case 'collection' : $scope.resultAlbums.push(data.results[i]);
                        break;
                    case 'artist' : $scope.resultArtists.push(data.results[i]);
                        break;
                }
            }
            $scope.tracklist = tracklistFactory.create($scope.resultTracks)
                .showName().showArtist().showAlbum().showLength().allowPlay().allowAddToPlaylist();
            $scope.albumlist = albumlistFactory.create($scope.resultAlbums);
            $scope.artistlist = artistlistFactory.create( $scope.resultArtists);
        })
    }

    function searchUsers(){
        APIService.search($scope.queryString, 'users').success(function(data){
            $scope.resultUsers = data.splice(0,10);
        })
    }

    console.log($stateParams);

    resetMusic();
    $scope.searchOptions = ['all', 'artists', 'albums', 'tracks','users'];
    $scope.selectedOption = 'all';

    $scope.search = function(){
        resetMusic();
        console.log($scope.queryString + ': ' + $scope.selectedOption);
        if($scope.selectedOption == 'all'){
            searchMusic();
            searchUsers();
        }
        else if($scope.selectedOption == 'users'){
            searchUsers();
        }
        else{
            searchMusic();
        }

    };

    function resetMusic(){
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



