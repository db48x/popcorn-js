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
      var target = document.createElement(options.type == "audio" ? "audio" : "video");
      target.setAttribute("src", options.src);
      target.setAttribute("width", options.width);
      target.setAttribute("height", options.height);
      target.setAttribute("id", this.id);
      target.setAttribute("preload", "auto");
      document.getElementById(options.target).appendChild(target);

      options._target = target;
      options._isIn = false;
      target.style.visibility = "hidden";

      var video = this.video;
      video.addEventListener("play", function() { if (options._isIn) target.play(); }, false);
      video.addEventListener("pause", function() { target.pause(); }, false);
      video.addEventListener("volumechange", function(event)
                             {
                               target.volume = video.volume;
                               target.muted = video.muted;
                             }, false);
    },
    start: function(event, options)
    {
      options._target.style.visibility = "visible";
      options._target.play();
      options._isIn = true;
    },
    end: function(event, options)
    {
      options._target.pause();
      options._target.style.visibility = "hidden";
      options._isIn = false;
    }
  });
})(Popcorn);
