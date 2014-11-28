angular.module('echonest', ['services'])

.factory('echonest', function($http, APIService){

        return {
            APIkey: '8MQ94F3HBSS6FA665',
            getArtistBiography: function(artistName, callback){
                    var artistNameWithoutSpace = artistName.split(' ').join('+');
                    $http.get('http://developer.echonest.com/api/v4/artist/biographies?api_key=8MQ94F3HBSS6FA665&name='
                        + artistNameWithoutSpace +'&license=cc-by-sa').success(function(data){
                        var biographyToReturn = '';
                        angular.forEach(data.response.biographies, function(biography){
                            if(biography.license.attribution == 'wikipedia'){
                                biographyToReturn = biography;
                            }
                        })
                        if(biographyToReturn == ''){
                            biographyToReturn = data.response.biographies[0];
                        }
                        var paragraphs = biographyToReturn.text.paragraphs();
                        console.log(biographyToReturn.text);
                        callback(biographyToReturn);
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

            },

            getSimilar: function(artistName, callback){
                var artistNameWithoutSpace = artistName.split(' ').join('+');
                $http.get('http://developer.echonest.com/api/v4/artist/similar?api_key=8MQ94F3HBSS6FA665&name='
                    + artistNameWithoutSpace +'&results=8').success(function(data){
                    var ubeatArtists = [];
                    var ubeatArtistsReceived= 0;
                    /*for(var i = 0; i < data.response.artists.length; i++){
                        APIService.search(artist.name, 'artists').success(function(data){
                            for(var i=0 ; i < data.results; i++){
                                if(artist.name == result.artistName){
                                    ubeatArtists.push(result);
                                }
                            }
                            /*angular.forEach(data.results, function(result){
                                if(artist.name == result.artistName){
                                    ubeatArtists.push(result);
                                }
                            })
                        });
                    }*/
                    angular.forEach(data.response.artists, function(artist){
                        APIService.search(artist.name, 'artists').success(function(data){
                            angular.forEach(data.results, function(result){
                                if(artist.name == result.artistName){
                                    ubeatArtists.push(result);
                                }

                            })
                            ubeatArtistsReceived++;
                            if(ubeatArtistsReceived == 8){
                                callback(ubeatArtists);
                            }
                        });
                    })
                })
            }

        }
    })

