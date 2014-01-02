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

require([
    'jquery',
    'underscore',
    'backbone',
    'paper'
], function($, _, Backbone) {
    var _view;

    with (paper) {
        paper.setup('canvas');

        _view = view;

        var Background = Backbone.Model.extend({
            defaults: {
                ID: '',
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                raster: null
            },
            initialize: function() {
                var attr = this.attributes;

                _.bindAll(this, '_changed');
                _.bindAll(this, '_changedScale');

                this.on('change', this._changed);
                this.on('change:scale', this._changedScale);

                var raster = new Raster(attr.ID);
                raster.position = {x: attr.x, y: attr.y};
                raster.opacity = attr.opacity;
                raster.scale(attr.scale);

                this.set({'raster': raster});


                this.soundcloud();
            },
            _changed: function() {
                var attr = this.attributes;
                var raster = this.get('raster');

                raster.position.x = attr.x;
                raster.position.y = attr.y;
                raster.opacity = attr.opacity;
            },
            _changedScale: function() {
                this.get('raster').scale(this.get('scale'));
            },
            soundcloud: function() {
            }
        });

        var path1 = new Path.Circle(view.center, 10);

        var bg = new Background({
            ID: 'bg-morning-blur',
            x: view.center.x,
            y: view.center.y
        });

        var bgMask = new Background({
            ID: 'bg-morning',
            x: view.center.x,
            y: view.center.y
        });

        var group = new Group(path1, bgMask.get('raster'));
        group.clipped = true;

        // var mask = new Image();
        // mask.src = 'img/background/screen.png';
        // mask.onload = function() {
            // var raster = bgMask.get('raster');
            // raster.drawImage(mask, [0, 0]);

            // var newRaster = raster.getSubRaster(new Rectangle(0, 0, 500, 500));
            // newRaster.blendMode = 'screen';

            // raster.remove();
        // }


        // var mask = new Raster({
        //     ID: 'mask',
        //     x: view.center.x,
        //     y: view.center.y
        // });

        var maskScale = 1;

        resize();
        paper.view.draw();

        $(document).click(function(event) {
            path1.position = [event.clientX, event.clientY];
            rescale(path1, 10, 10, 1);
            maskScale = 1;
        });

        $(document).on('orientationchange', handleOrientationChange);

        $(window).resize(function() {
            resize();
        });

        view.onFrame = function(event) {
            // delta; time; count;
            var scaleSpeed= 10;
            var maxScale = 25;

            maskScale += scaleSpeed * event.delta;

            if (maskScale > maxScale) {
                maskScale = maxScale;
            }

            //opacity
            var opacity = 1 - (maskScale / maxScale);
            group.opacity = opacity;

            rescale(path1, 10, maskScale);
        }

        function handleOrientationChange(event) {
            resize();
        }

        function rescale(obj, originalWidth, scale) {
            var bounds = obj.bounds;
            var scaleFactor =  originalWidth / obj.bounds.width;

            obj.scale(scaleFactor);
            obj.scale(scale);
        }

        function resize() {
            var $window = $(window);
            var raster = bg.get('raster');
            var newScale = 1;

            if ($window.height() > $window.width()) {
                newScale = $window.height() / raster.height;
            } else {
                newScale = $window.width() / raster.width;
            }

            rescale(bg.get('raster'), 800, newScale);
            rescale(bgMask.get('raster'), 800, newScale);

            bg.set({x: _view.center.x, y: _view.center.y});
            bgMask.set({x: _view.center.x, y: _view.center.y});
        }
    } // with paper
});
