angular.module('followButtonModule', ['ui.router', 'services'])

.directive('followButton', function(){
    return{
        restrict: 'E',
        scope:{
            userInfo: '=',
            currentUser: '='
        },
        templateUrl: '/js/controls/followButton/followButton.html'
    };
})

.controller('followButtonController', function($scope, APIService){

    $scope.canFollow = function(){
        return !$scope.isCurrentUser() && !inCurrentUserFollowList();
    }

    $scope.canUnfollow = function() {
        return !$scope.isCurrentUser() && inCurrentUserFollowList();
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
