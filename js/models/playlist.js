define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Playlist = Backbone.Model.extend({
        defaults: {
            playlist: undefined,
            sound: undefined,
            index: 0
        },
        initialize: function() {
            var that = this;
            var playlist = this.get('playlist');
            var index = this.get('index');

            if (typeof playlist === 'undefined') {
                return;
            } else {
                this.start(index);
            }
        },
        start: function(index) {
            var that = this;
            var sound = this.get('sound');
            var playlist = this.get('playlist');

            if (typeof sound === 'object') {
                sound.stop();
            }

            // TODO: check index bounds
            SC.stream(playlist.tracks[index].uri, {
                ontimedcomments: function(comments) {
                    console.log(comments);

                    for(var i=0; i<comments.length; i++) {
                        var comment = comments[i];
                        console.log(comment.body, comment.user.username, comment.user.avatar_url, comment.user.permalink_url);
                    }
                },
                whileplaying: function() {
                    // console.log(this.position, this.duration, this.durationEstimate);
                },
                onfinish: function() {
                    console.log('finish');
                    that.next();
                }
            }, function(sound) {
                console.log(sound);
                that.set({sound: sound, index: index});
                that.play();
            });
        },
        next: function() {
            var index = this.get('index');
            var playlist = this.get('playlist');

            if (index === playlist.tracks.length - 1) {
                index = 0;
            } else {
                index++;
            }

            this.start(index);
        },
        prev: function() {
            var index = this.get('index');
            var playlist = this.get('playlist');

            if (index === 0) {
                index = playlist.tracks.length - 1;
            } else {
                index--;
            }

            this.start(index);
        },
        play: function() {
            var sound = this.get('sound');

            sound.pause();
            sound.play();
        },
        pause: function() {
            var sound = this.get('sound');
            sound.pause();
        }
    });

    return Playlist;
});
