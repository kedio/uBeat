angular.module('userslist', [])

    .directive('userslist', function(){
        return{
            restrict: 'E',
            scope:{
                users: '='
            },
            templateUrl: '/js/controls/userlist/userlist.html'
        };
    })

    .controller('userslistController', function($scope, echonest){
        $scope.$watch('users', function(newusers){
            if(newusers == undefined){
                return;
            }
            angular.forEach(newusers, function(user){
                if(user.userPicture == undefined){
                    user.userPicture = 'http://executivewinners.ca/wp-content/uploads/2013/11/generic_user_male.jpg'
                }
            })
        })
    });
