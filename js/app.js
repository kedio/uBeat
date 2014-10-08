var ubeatcore = angular.module('ubeatcore', ['ui.router', 'artist','album']);

ubeatcore.controller('mainController', function($scope, $state) {
    $scope.state = $state;
});


ubeatcore.config(function ($locationProvider, $httpProvider, $stateProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $httpProvider.interceptors.push('TokenInterceptor');

    $stateProvider.state('public', {
        abstract: true,
        templateUrl: '<ui-view></ui-view>',
        data: {
            authentificationRequired: false
        }
    });
    $stateProvider.state('user', {
        abstract: true,
        templateUrl: '<ui-view></ui-view>',
        data: {
            authentificationRequired: true
        }
    });
});

ubeatcore.run(function($rootScope, $state, AuthenticationService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (toState.data.accessLimited) {
            console.log('access denied');
            $rootScope.error = "Access denied";
            event.preventDefault();

            if(fromState.url === '^') {
                if(AuthenticationService.isAuthenticated())
                    $state.go('user.home');
                else {
                    $rootScope.error = null;
                    $state.go('public.login');
                }
            }
        }
    });
});


