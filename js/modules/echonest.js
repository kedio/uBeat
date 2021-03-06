angular.module('echonest', ['services'])

.factory('echonest', function($http, APIService){

        function matchUBeatArtistsAndEchonestArtist(echonestArtist, ubeatArtists, callback){
            var matchingByName = [];
            angular.forEach(ubeatArtists, function(artist){
                if(echonestArtist.name.toUpperCase() == artist.artistName.toUpperCase()){
                    matchingByName.push(artist);
                }
            });
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
                    + artistNameWithoutSpace).success(function(data){
                    var imageURL = data.response.images[0].url;
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
            },

            getTopHottt: function(callback){
                $http.get('http://developer.echonest.com/api/v4/artist/top_hottt?api_key=8MQ94F3HBSS6FA665' +
                    '&format=json&results=10&start=0&bucket=hotttnesss').success(function(data){
                    var ubeatArtists = [];
                    var ubeatArtistsReceived = 0;
                    angular.forEach(data.response.artists, function(artist){
                        APIService.search(artist.name, 'artists').success(function(data){
                            matchUBeatArtistsAndEchonestArtist(artist, data.results, function(bestMatch){
                                console.log(artist.hotttnesss);
                                bestMatch.hotttnesss = artist.hotttnesss;
                                ubeatArtists.push(bestMatch);
                                ubeatArtistsReceived++;
                                if(ubeatArtistsReceived == 10){
                                    callback(ubeatArtists.sortBy('hotttnesss', true));
                                }
                            });

                        });
                    })
                })

            }

        }
    })