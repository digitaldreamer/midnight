define(['jquery', 'underscore', 'backbone'], function() {
    var User = Backbone.Model.extend({
        defaults: {
            position: {lat: 0, lon: 0, accuracy: 0}
        },
        initialize: function() {
            this.getLocation();
        },
        getLocation: function() {
            var that = this;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(location) {
                    that.set({
                        position: {
                            lat: location.coords.latitude,
                            lon: location.coords.longitude,
                            accuracy: location.coords.accuracy
                        }
                    });
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
