angular.module('gracenote', [])

.factory('gracenote', function($http){

        return {
            APIkey: '8MQ94F3HBSS6FA665',
            getArtistBiography: function(artistName, callback){
                    var artistNameWithoutSpace = artistName.split(' ').join('+');
                    $http.get('http://developer.echonest.com/api/v4/artist/biographies?api_key=8MQ94F3HBSS6FA665&name='
                        + artistNameWithoutSpace +'&license=cc-by-sa').success(function(data){
                        var biographyText = '';
                        angular.forEach(data.response.biographies, function(biography){
                            if(biography.license.attribution == 'Last.fm'){
                                biography = biography.text;
                            }
                        })
                        if(biographyText == ''){
                            biographyText = data.response.biographies[0].text;
                        }
                        callback(biographyText);
                    })
                },
            getArtistImage: function(artistName, callback){
                var artistNameWithoutSpace = artistName.split(' ').join('+');
                $http.get('http://developer.echonest.com/api/v4/artist/images?api_key=8MQ94F3HBSS6FA665&name='
                    + artistNameWithoutSpace +'&license=cc-by-sa').success(function(data){
                    var imageURL = '';
                    angular.forEach(data.response.images, function(image){
                        if(image.license.attribution == 'last.fm'){
                            imageURL = image.url;
                        }
                    })
                    if(imageURL == ''){
                        imageURL = data.response.images[0].url;
                    }
                    callback(imageURL);
                })
            }

        }
    })

