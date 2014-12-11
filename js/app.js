var ubeatcore = angular.module('ubeatcore', ['ui.router', 'angular-loading-bar', 'artist', 'album', 'playlists', 'userInfo', 'user','search','tracks','gravatar', 'home']);

ubeatcore.controller('mainController', function($scope, $state, $location, gravatar) {
    $scope.state = $state;

    $scope.$watch('user', function(newUser){
        if(newUser){
            newUser.userPicture = gravatar.getAvatar(newUser.email);
        }
    });

    $scope.search = function(query) {
        $location.path('/search').search({q: query});
    };
});


ubeatcore.config(function ($locationProvider, $urlRouterProvider,  $httpProvider, $stateProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $httpProvider.interceptors.push('TokenInterceptor');

    $stateProvider.state('public', {
        abstract: true,
        template: '<ui-view></ui-view>',
        data: {
            authentificationRequired: false
        }
    });
    $stateProvider.state('private', {
        abstract: true,
        templateUrl: '/partials/private.html',
        data: {
            authentificationRequired: true
        }
    });
    $stateProvider.state('private.home', {
        url: '/home',
        templateUrl: '/partials/private.home.html'
    });

    $urlRouterProvider.otherwise('/home');
});

ubeatcore.run(function($rootScope, $state, AuthenticationService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (toState.data.authentificationRequired && !AuthenticationService.getToken()) {
            console.log('access denied');
            $rootScope.error = "Access denied";
            event.preventDefault();

            if(fromState.url === '^') {
                if(AuthenticationService.isAuthenticated())
                    $state.go('private.home');
                else {
                    $rootScope.error = null;
                    $state.go('public.login');
                }
            }
        }
    });
});


