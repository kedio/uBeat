var userInfoModule = angular.module('userInfo', ['ui.router', 'services']);

userInfoModule.config(function($stateProvider) {
    $stateProvider.state('private.userInfo', {
        url: "/userinfo/:userId",
        templateUrl: "/partials/private.userInfo.html",
        controller: 'userInfoController'
    });
});

userInfoModule.controller('userInfoController', function($scope, $stateParams, APIService, playlistPanelFactory) {
    APIService.getUserInfo($stateParams.userId).success(function (data, status, headers, config) {
        $scope.userInfo = data;
    });
    APIService.getUserInfo($scope.user.id).success(function (data, status, headers, config) {
        $scope.currentUser = data;
    });

    APIService.getPlaylists().success(function(data, status, headers, config){
        $scope.userPlaylists = $.map($(data), function(playlist) {
            if(playlist.owner && playlist.owner.id == $stateParams.userId)
                return playlistPanelFactory.create(playlist).canBePlayed();
            else
                return null;
        });
    });

    $scope.canFollow = function(){
        return !$scope.isCurrentUser() && !inCurrentUserFollowList();
    }

    $scope.isCurrentUser = function(){
        if($scope.userInfo && $scope.currentUser)
            return $scope.userInfo.id == $scope.currentUser.id;
        else
            return false;
    }

    var inCurrentUserFollowList = function() {
        var inFollowList = false;
        if($scope.userInfo && $scope.currentUser){
            $scope.currentUser.following.forEach(function(followingUser){
                if(followingUser.id == $scope.userInfo.id)
                    inFollowList = true;
            });
        }
        return inFollowList;
    }

    $scope.follow = function(userId){
        APIService.followUser(userId).success(function (data, status, headers, config){
            $scope.currentUser.following = data.following
        });
    }

    $scope.unfollow = function(userId){
        APIService.unfollowUser(userId).success(function (data, status, headers, config){
            $scope.currentUser.following = data.following
        });
    }

});