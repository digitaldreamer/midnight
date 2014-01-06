define(['jquery', 'underscore', 'backbone'], function() {
    var User = Backbone.Model.extend({
        defaults: {
            FORECAST_KEY: '855fb297d70e73a256060da15d6bda6a',
            position: {lat: 0, lon: 0, accuracy: 0}
        },
        initialize: function() {
            this.getLocation();
        },
        getLocation: function() {
            var that = this;

            console.log('get location');

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(location) {
                    that.set({
                        position: {
                            lat: location.coords.latitude,
                            lon: location.coords.longitude,
                            accuracy: location.coords.accuracy
                        }
                    });

                    that.getWeather();
                    that.geocode();
                });
            } else {
                console.log('Geolocation is not supported');
            }
        },
        getDistance: function(lat, lon, units) {
            var position = this.get('position');

            // force units to either 'miles' or 'km'
            // default to 'miles'
            if (typeof units === 'undefined') {
                units = 'miles';
            } else if (units !== 'km' || units !== 'miles') {
                units = 'miles';
            }

            return haversine(position.lat, position.lon, lat, lon, units);
        },
        getWeather: function() {
            // get the weather information from forecast.io
            var URL = 'https://api.forecast.io/forecast/' + this.get('FORECAST_KEY') + '/';
            var position = this.get('position');
            var full_url = URL + position.lat + ',' + position.lon;

            console.log('WEATHER');
            console.log(full_url);

            // TODO: this call needs to be moved to the server for xdomain security
            // $.ajax({
            //     url: full_url,
            //     type: 'GET',
            //     dataType: 'json',
            //     success: function(data) {
            //         console.log(data);
            //     }
            // });
        },
        geocode: function() {
            var position = this.get('position');
            var geocoder = new google.maps.Geocoder();
            var latLng = new google.maps.LatLng(position.lat, position.lon);

            geocoder.geocode({'latLng': latLng}, function(results, status) {
                console.log('GEOCODE');
                console.log(results);
                console.log(status);

                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]){
                        var result = results[1];
                        console.log(result);

                        for (var i=0; i<result.address_components.length; i++) {
                            if (result.address_components[i].types[0] === 'administrative_area_level_2') {
                                console.log('City: ' + result.address_components[i].long_name);
                            } else if (result.address_components[i].types[0] === 'administrative_area_level_1') {
                                console.log('State: ' + result.address_components[i].short_name);
                            } else if (result.address_components[i].types[0] === 'country') {
                                console.log('Country: ' + result.address_components[i].long_name);
                            } else if (result.address_components[i].types[0] === 'postal_code') {
                                console.log('Postal Code: ' + result.address_components[i].long_name);
                            }
                        }
                    } else {
                        console.log('no results found');
                    }
                } else {
                    console.log('geocoder failed');
                }
            });
        }
    });

    function haversine(lat1, lon1, lat2, lon2, units) {
        units = units || 'miles';
        var radius = 3960;  // Radius of the earth in miles

        if (units === 'km') {
            radius = 6371;  // Radius of the earth in km
        }

        var latDelta = deg2rad(lat2 - lat1);
        var lonDelta = deg2rad(lon2 - lon1);
        var a = Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distance = radius * c;

        return distance;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    return User;
});
