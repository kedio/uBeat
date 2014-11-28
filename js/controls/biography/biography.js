angular.module('biography', [])

    .directive('biography', function(){
        return{
            restrict: 'E',
            scope:{
                text: '=',
                url: '='
            },
            templateUrl: '/js/controls/biography/biography.html'
        };
    })

    .controller('biographyController', function($scope){
        $scope.$watch('text', function(newText){
            if(newText == undefined){
                return;
            }
            $scope.text = newText.paragraphs()[0];
        })
    })