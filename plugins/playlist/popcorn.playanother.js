/* Playanother plugin
 * 
 *   Synchronized playback of another audio or video track.
 * 
 * Options
 *   type:    Either 'audio' or 'video'
 *   src:     a URL, either relative or absolute
 *   target:  the ID of an element within which the audio or video should be shown
 *   width:   the width of the video element
 *   height:  the height of the video element
 */

(function (Popcorn)
{
  Popcorn.plugin("playanother",
  {
    _setup: function(options)
    {
      var target = $(options.type == "audio" ? "<audio/>" : "<video/>",
                     { src: options.src,
                       width: options.width,
                       height: options.height,
                       id: this.id,
                       preload: 'auto'
                     });

      options._target = target;
      options._isIn = false;
      target.hide();
      $("#"+ options.target).append(target);

      var vid = $(this.video);
      vid.bind("play", function() { if (options._isIn) target.get(0).play(); })
         .bind("pause", function() { target.get(0).pause(); })
         .bind("volumechange", function(event)
      {
        target.get(0).volume = vid.volume;
        target.get(0).muted = vid.muted;
      });
    },
    start: function(event, options)
    {
      options._target.show();
      options._target.get(0).play();
      options._isIn = true;
    },
    end: function(event, options)
    {
      options._target.get(0).pause();
      options._target.hide();
      options._isIn = false;
    }
  });
})(Popcorn);
