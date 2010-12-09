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
        $(this).bind("ended", function() { (current = tracks[(i == len) ? 0 : i+1]).play(); });
      });

      var self = this;
      var vid = $(this.video);
      vid.bind("play", function() { if (self.isIn) current.play(); })
         .bind("pause", function() { tracks.each(function() { this.pause(); }); })
         .bind("ended", function() { tracks.each(function() { this.pause(); }); })
         .bind("volumechange", function()
      {
        music.each(function()
        {
          this.volume = vid.volume;
          this.muted = vid.muted;
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
