(function (Popcorn)
{
  Popcorn.plugin("playlist" , (function()
  {
    var target, tracks, len, current;
    var isIn = false;

    return {
      _setup: function(event, options)
      {
        alert('_setup');
        target = $("#"+ options.target);
        tracks = target.children("audio, video");
        len = tracks.length;
        current = tracks[0];

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
        alert('start');
        current.play();
        this.isIn = true;
      },
      end: function(event, options)
      {
        alert('end');
        tracks.each(function() { this.pause(); });
        this.isIn = false;
     },
    };
  }));
})(Popcorn);
