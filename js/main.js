var SITE = SITE || {};

requirejs.config({
    paths: {
        'backbone': 'libs/backbone',
        'bootstrap': 'libs/bootstrap',
        'jquery': 'libs/jquery-1.10.2.min',
        'jquery.cookie': 'libs/jquery.cookie',
        'jquery.easing': 'libs/jquery.easing',
        'jquery.json': 'libs/jquery.json',
        'paper': 'libs/paper',
        'underscore': 'libs/underscore'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            deps: ['jquery'],
            exports: '_'
        },
        'jquery.cookie': ['jquery'],
        'jquery.easing': ['jquery'],
        'jquery.json': ['jquery']
    }
});

require(['jquery', 'underscore', 'backbone',
        'models/playlist',
        'models/user'
], function($, _, Backbone, Playlist, User) {
    SITE.soundcloud = new function() {
        var that = this;

        this.user = null;
        this.playlist = null;
        this.init = function() {
            this.user = new User();

            // soundcloud
            SC.initialize({
                client_id: 'e3d0ef8cde5621f2c66f2782627b8ad7'
            });

            SC.get('/playlists/18889687', function(playlist) {
                console.log(playlist);
                that.playlist = new Playlist({playlist: playlist});
            });

            // TODO: move to view
            // events
            $('.play').on('click', function(event) {
                event.preventDefault();
                that.playlist.play();
            });
            $('.pause').on('click', function(event) {
                event.preventDefault();
                that.playlist.pause();
            });
            $('.prev').on('click', function(event) {
                event.preventDefault();
                that.playlist.prev();
            });
            $('.next').on('click', function(event) {
                event.preventDefault();
                that.playlist.next();
            });


            var currentdate = new Date();
            var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

            console.log(datetime);

            // GYROSCOPE
            // if (window.DeviceMotionEvent==undefined) {
            // }
            // window.ondevicemotion = function(event) {
            //     ax = event.accelerationIncludingGravity.x
            //     ay = event.accelerationIncludingGravity.y
            //     az = event.accelerationIncludingGravity.z
            //     rotation = event.rotationRate;

            //     if (rotation != null) {
            //         arAlpha = Math.round(rotation.alpha);
            //         arBeta = Math.round(rotation.beta);
            //         arGamma = Math.round(rotation.gamma);
            //     }
            // }

            // window.ondeviceorientation = function(event) {
            //     alpha = Math.round(event.alpha);
            //     beta = Math.round(event.beta);
            //     gamma = Math.round(event.gamma);
            // }
        }

        function embedable() {
            var track_url = 'http://soundcloud.com/forss/flickermood';
            SC.oEmbed(track_url, { auto_play: true }, document.getElementById('soundcloud'), function(oEmbed) {
                console.log('oEmbed response: ' + oEmbed);
            });
        }
    }

    SITE.soundcloud.init();
});
