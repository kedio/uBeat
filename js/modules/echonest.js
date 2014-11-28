angular.module('echonest', ['services'])

.factory('echonest', function($http, APIService){

        function matchUBeatArtistsAndEchonestArtist(echonestArtist, ubeatArtists, callback){
            var matchingByName = []
            angular.forEach(ubeatArtists, function(artist){
                if(echonestArtist.name.toUpperCase() == artist.artistName.toUpperCase()){
                    matchingByName.push(artist);
                }
            })
            var maxAlbum = 0;
            var bestMatch = undefined;
            var matchAnalysed = 0;
            if(matchingByName.length != 1){
                angular.forEach(matchingByName, function(match){
                    APIService.getAlbumsForArtist(match.artistId).success(function(data){
                        if(data.results.length > maxAlbum){
                            maxAlbum = data.results.length;
                            bestMatch = match;
                        }
                        matchAnalysed++;
                        if(matchAnalysed == matchingByName.length){
                            callback(bestMatch);
                        }
                    })
                })
            }
            else{
                callback(matchingByName[0])
            }


        }
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
                        callback(biographyToReturn);
                    })
                },
            getArtistImage: function(artistName, callback){
                var artistNameWithoutSpace = artistName.split(' ').join('+');
                $http.get('http://developer.echonest.com/api/v4/artist/images?api_key=8MQ94F3HBSS6FA665&name='
                    + artistNameWithoutSpace +'&license=cc-by-sa').success(function(data){
                    var imageURL = undefined;
                    angular.forEach(data.response.images, function(image){
                        if(image.license.attribution == 'last.fm'){
                            imageURL = image.url;
                        }
                    })
                    if(imageURL == undefined && data.response.images.length != 0){
                        imageURL = data.response.images[0].url;
                    }
                    callback(imageURL);
                })

            },

            getSimilar: function(artistName, callback){
                var artistNameWithoutSpace = artistName.split(' ').join('+');
                $http.get('http://developer.echonest.com/api/v4/artist/similar?api_key=8MQ94F3HBSS6FA665&name='
                    + artistNameWithoutSpace +'&results=6').success(function(data){
                    var ubeatArtists = [];
                    var ubeatArtistsReceived= 0;
                    angular.forEach(data.response.artists, function(artist){
                        APIService.search(artist.name, 'artists').success(function(data){
                            matchUBeatArtistsAndEchonestArtist(artist, data.results, function(bestMatch){
                                ubeatArtists.push(bestMatch);
                                ubeatArtistsReceived++;
                                if(ubeatArtistsReceived == 6){
                                    callback(ubeatArtists);
                                }
                            });

                        });
                    })
                })
            }

        }
    })