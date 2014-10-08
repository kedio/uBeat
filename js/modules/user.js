var user =  angular.module('user', ['ui.router']);
user.config(function($stateProvider)  {
    $stateProvider.state('public.login', {
        url: '/login',
        templateUrl: '/partials/public.login.html',
        controller: 'UserLoginController'
    });
});


user.controller('UserLoginController', function UserController($scope, $location, $window, APIService, AuthenticationService) {
    $scope.login = function(email, password) {
        if (email != null && password != null) {
            APIService.login(email, password).success(function(user) {
                console.log('suecess login');
                $scope.error = false;
                AuthenticationService.setAuthenticated(true);
                AuthenticationService.setUser(user);
                $location.path("/home");
            }).error(function(data, status) {
                console.log(status);
                if(status == 401) {
                    $scope.error = "Access denied, please enter a valid email and password.";
                } else {
                    $scope.error = "An error happened, please try again.";
                }
            });
        } else {
            $scope.error = "Please enter both your email and your password"
        }
    };
});

user.controller('UserLogoutController', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function UserLogoutController($scope, $location, $window, UserService, AuthenticationService) {
        UserService.logOut().success(function(data) {
            AuthenticationService.setAuthenticated(false);
            delete $window.sessionStorage.token;
        }).error(function(status, data) {
            AuthenticationService.setAuthenticated(false);
            delete $window.sessionStorage.token;
            console.log(status);
            console.log(data);
        });
        $location.path("/");
    }
]);
