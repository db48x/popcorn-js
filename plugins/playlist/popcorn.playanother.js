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
  Popcorn.plugin("playanother", function(options)
  {
    var target = document.createElement(options.type == "audio" ? "audio" : "video");
    target.setAttribute("src", options.src);
    target.setAttribute("width", options.width);
    target.setAttribute("height", options.height);
    target.setAttribute("id", this.id);
    target.setAttribute("preload", "auto");
    document.getElementById(options.target).appendChild(target);

    var isIn = false;
    target.style.visibility = "hidden";

    var video = this.video;
    self.listen("play", function() { if (isIn) target.play(); }, false);
    self.listen("pause", function() { target.pause(); }, false);
    self.listen("volumechange", function(event)
                {
                  if (isIn)
                  {
                    target.volume = video.volume;
                    target.muted = video.muted;
                  }
                }, false);

    return {
      start: function(event, options)
      {
        target.currentTime = video.currentTime - options.start;
        target.style.visibility = "visible";
        target.play();
        isIn = true;
      },
      end: function(event, options)
      {
        target.pause();
        target.style.visibility = "hidden";
        isIn = false;
      }
    };
  });
})(Popcorn);
