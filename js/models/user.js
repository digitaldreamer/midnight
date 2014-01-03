define(['jquery', 'underscore', 'backbone'], function() {
    var User = Backbone.Model.extend({
        defaults: {
            position: {latitude: 0, longitude: 0, accuracy: 0}
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
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            accuracy: location.coords.accuracy
                        }
                    });
                });
            } else {
                console.log('Geolocation is not supported');
            }
        }
    });

    return User;
});
