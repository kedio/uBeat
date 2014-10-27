var ubeatcore = angular.module('ubeatcore', ['ui.router', 'artist', 'album', 'playlists', 'user']);

ubeatcore.controller('mainController', function($scope, $state) {
    $scope.state = $state;
});


ubeatcore.config(function ($locationProvider, $urlRouterProvider,  $httpProvider, $stateProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
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

    $urlRouterProvider.otherwise('/login');
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


