var userInfoModule = angular.module('userInfo', ['ui.router', 'services', 'followButtonModule']);

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

});