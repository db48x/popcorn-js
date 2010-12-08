(function (Popcorn) {
  Popcorn.plugin("playanother", (function()
  {
    var target, isIn;

    return {
      _setup: function(event, options)
      {
        target = $(options.type == "audio" ? "<audio/>" : "<video/>",
                   { src: options.src,
                     width: options.width,
                     height: options.height,
                     id: this.id,
                     preload: 'auto'
                   });

        target.hide();
        $("#"+ options.target).append(target);

        var self = this;
        var vid = $(this.video);
        vid.bind("play", function() { if (self.isIn) target.get(0).play(); })
           .bind("pause", function() { target.get(0).pause(); })
           .bind("volumechange", function(event)
        {
          target.get(0).volume = vid.volume;
          target.get(0).muted = vid.muted;
        });
      },
      start: function(event, options)
      {
        target.show();
        target.get(0).play();
        this.isIn = true;
      },
      end: function(event, options)
      {
        target.get(0).pause();
        target.hide();
        this.isIn = false;
      },
    };
  }));
})(Popcorn);