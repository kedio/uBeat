var searchModule = angular.module('search', ['ui.router', 'services','albumlistModule','tracklist','artistlist','userslist']);

searchModule.config(function($stateProvider) {
    $stateProvider.state('private.search', {
        url: "/search",
        templateUrl: "/partials/private.search.html",
        controller: 'searchController',
        params: {q: null, type: null}
    });

});

searchModule.controller('searchController', function($scope, $stateParams, $location, APIService, tracklistFactory, artistlistFactory) {

    function searchMusic(){
        APIService.search($scope.queryString, $scope.selectedOption).success(function(data){
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
            $scope.artistlist = artistlistFactory.create( $scope.resultArtists);
        })
    }

    function searchUsers(){
        APIService.search($scope.queryString, 'users').success(function(data){
            $scope.resultUsers = data.splice(0,10);
        })
    }

    console.log($stateParams);

    reset();
    $scope.searchOptions = ['all', 'artists', 'albums', 'tracks','users'];
    $scope.selectedOption = 'all';


    $scope.search = function(){
        reset();
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

    function reset(){
        $scope.resultArtists = [];
        $scope.resultAlbums = [];
        $scope.resultTracks = [];
        $scope.resultUsers = [];
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



