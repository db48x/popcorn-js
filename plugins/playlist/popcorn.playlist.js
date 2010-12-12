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
