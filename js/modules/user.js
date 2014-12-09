var user =  angular.module('user', ['ui.router']);
user.config(function($stateProvider)  {
    $stateProvider.state('public.login', {
        url: '/login',
        templateUrl: '/partials/public.login.html',
        controller: 'UserLoginController'
    });
    $stateProvider.state('public.logout', {
        url: '/logout',
        controller: 'UserLogoutController'
    });
    $stateProvider.state('public.signup', {
        url: '/signup',
        templateUrl: '/partials/public.signup.html',
        controller: 'UserSignupController'
    });
});


user.controller('UserLoginController', function ($scope, $rootScope, $location, $window, APIService, AuthenticationService) {
    $scope.login = function(email, password) {
        if (email != null && password != null) {
            APIService.login(email, password).success(function(user) {
                console.log('success login');
                $scope.error = false;
                $rootScope.success = false;
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

user.controller('UserSignupController', function ($scope, $rootScope, $location, $window, APIService) {
    $scope.signup = function(name, email, password) {
        if (email != null && password != null && name != null) {
            APIService.signup(name, email, password).success(function(user) {
                $rootScope.success = "Your account was created successfully. Now you can login by entering your credentials.";
                $location.path("/login");
            }).error(function(data, status) {
                console.log(status);
                $scope.error = "An error happened, please try again.";
            });
        } else {
            $scope.error = "Please enter both your name, email and your password"
        }
    };
});

user.controller('UserLogoutController', function($scope, $rootScope, $location, $window, APIService, AuthenticationService) {
    APIService.logout().success(function() {
        AuthenticationService.logout();
        delete $window.sessionStorage.token;
        $rootScope.success = "You have been logged out successfully.";
    }).error(function(status, data) {
        AuthenticationService.logout();
        delete $window.sessionStorage.token;
        $rootScope.success = "You have been logged out successfully.";
        console.log(status);
        console.log(data);
    });
    $location.path("/login");
});
