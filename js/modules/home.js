angular.module('home',['echonest'])

.controller('homeController', function($scope, echonest){
        echonest.getTopHottt(function(artists){
            $scope.hotttArtists = artists;
        })
    });
