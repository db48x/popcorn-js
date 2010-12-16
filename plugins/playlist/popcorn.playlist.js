/* Playlist plugin
 * 
 *   Play a sequence of tracks (audio or video) for as long as the primary
 * video is playing.
 * 
 * Options
 *   target:  ID of an element that contains one or more <audio> or <video> tags
 */

(function (Popcorn)
{
  Popcorn.plugin("playlist",
  {
    _setup: function(options)
    {
      var target = options._target = $("#"+ options.target),
          tracks = options._tracks = target.children("audio, video"),
          current = options._current = tracks[0];
      options._isIn = false;

      var len = tracks.length;
      tracks.each(function(i)
      {
        $(this).bind("ended", function() { (options._current = tracks[(i+1 == len) ? 0 : i+1]).play(); });
      });

      var self = this;
      var video = this.video;
      $(video).bind("play", function() { if (self.isIn) current.play(); })
              .bind("pause", function() { tracks.each(function() { this.pause(); }); })
              .bind("ended", function() { tracks.each(function() { this.pause(); }); })
              .bind("seeked", function()
              {
                var time = video.currentTime;
                var str ="";
                tracks.each(function()
                {
                  str += [time, this.duration].toSource() +"\n";
                  if (time < this.duration && time >= 0)
                  {
                    this.currentTime = time;
                    this.play();
                  }
                  else
                    this.pause();
                  time -= this.duration;
                });
              })
              .bind("volumechange", function()
              {
                tracks.each(function()
                {
                  this.volume = video.volume;
                  this.muted = video.muted;
                });
              });
    },
    start: function(event, options)
    {
      options._current.play();
      options._isIn = true;
    },
    end: function(event, options)
    {
      options._tracks.each(function() { this.pause(); });
      options._isIn = false;
   },
  });
})(Popcorn);
