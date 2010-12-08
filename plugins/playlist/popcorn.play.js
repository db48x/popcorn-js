(function (Popcorn) {
  Popcorn.plugin("play" , (function()
  {
    var target = $(this.params.type == "audio" ? "<audio/>" : "<video/>",
                   { src: this.params.src,
                     width: this.params.width,
                     height: this.params.height,
                     id: this.id,
                     preload: 'auto'
                   });
    target.hide();
    $("#"+ this.params.target).append(target);

    this.target = target;
    this.isIn = false;

    return {
      _setup: function(event, options)
      {
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