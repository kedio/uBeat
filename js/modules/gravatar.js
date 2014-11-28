angular.module('gravatar', [])

    .factory('gravatar', function($http, APIService){

        return {
            getAvatar: function(email){
                var hash = CryptoJS.MD5(email);
                return 'http://www.gravatar.com/avatar/'+ hash + '?s=100&d=mm';
            }

        }
    })
