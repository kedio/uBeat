angular.module('userslist', ['gravatar'])

    .directive('userslist', function(){
        return{
            restrict: 'E',
            scope:{
                currentUser: '=',
                users: '='
            },
            templateUrl: '/js/controls/userlist/userlist.html'
        };
    })

    .controller('userslistController', function($scope, gravatar, APIService){
        $scope.$watch('users', function(newusers){
            if(newusers == undefined){
                return;
            }
            angular.forEach(newusers, function(user){
                if(user.userPicture == undefined){
                    user.userPicture = gravatar.getAvatar(user.email);
                }
            })
        })
    });
