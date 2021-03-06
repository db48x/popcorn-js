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
      var target = options._target = document.getElementById(options.target),
          tracks = [];

      var len = target.children.length;
      for (var i = 0; i < len; i++)
      {
        var child = target.children[i];
        if (child.localName == "audio" || child.localName == "video")
          tracks.push(child);
      }

      var current = options._current = tracks[0];
      options._tracks = tracks;
      options._isIn = false;

      len = tracks.length;
      for (i = 0; i < len; i++)
      {
        tracks[i].addEventListener("ended", function() { (options._current = tracks[(i+1 == len) ? 0 : i+1]).play(); }, false);
      }

      function pause()
      {
        var len = tracks.length;
        for (var i = 0; i < len; i++)
        {
          tracks[i].pause();
        }
      }

      var self = this;
      var video = this.video;
      video.addEventListener("play", function() { if (self.isIn) current.play(); }, false);
      video.addEventListener("pause", pause, false);
      video.addEventListener("ended", pause, false);
      video.addEventListener("seeked", function()
                             {
                               var time = video.currentTime;
                               var len = tracks.length;
                               for (var i = 0; i < len; i++)
                               {
                                 var track = tracks[i];
                                 if (time < track.duration && time >= 0)
                                 {
                                   track.currentTime = time;
                                   track.play();
                                 }
                                 else
                                   track.pause();
                                 time -= track.duration;
                               }
                             }, false);
      video.addEventListener("volumechange", function()
                             {
                               var len = tracks.length;
                               for (var i = 0; i < len; i++)
                               {
                                 tracks[i].volume = video.volume;
                                 tracks[i].muted = video.muted;
                               }
                             }, false);
    },
    start: function(event, options)
    {
      options._current.play();
      options._isIn = true;
    },
    end: function(event, options)
    {
      var len = options._tracks.length;
      for (var i = 0; i < len; i++)
      {
        options._tracks[i].pause();
      }
      options._isIn = false;
   },
  });
})(Popcorn);
