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
  Popcorn.plugin("playlist", function(options)
  {
    var target = document.getElementById(options.target),
        tracks = [];

    var len = target.children.length;
    for (var i = 0; i < len; i++)
    {
      var child = target.children[i];
      if (child.localName == "audio" || child.localName == "video")
        tracks.push(child);
    }

    var current = current = tracks[0];
    var isIn = false;

    len = tracks.length;
    for (i = 0; i < len; i++)
    {
      tracks[i].addEventListener("ended", function() { (current = tracks[(i+1 == len) ? 0 : i+1]).play(); }, false);
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
    self.listen("play", function() { if (isIn) current.play(); }, false);
    self.listen("pause", pause, false);
    self.listen("ended", pause, false);
    self.listen("seeked", function()
                {
                  var time = video.currentTime;
                  var len = tracks.length;
                  for (var i = 0; i < len; i++)
                  {
                    var track = tracks[i];
                    if (time < track.duration && time >= 0)
                    {
                      track.currentTime = time;
                      if (!video.paused)
                        track.play();
                    }
                    else
                      track.pause();
                    time -= track.duration;
                  }
                }, false);
    self.listen("volumechange", function()
                {
                  if (isIn)
                  {
                    var len = tracks.length;
                    for (var i = 0; i < len; i++)
                    {
                      tracks[i].volume = video.volume;
                      tracks[i].muted = video.muted;
                    }
                  }
                }, false);

    return {
      start: function(event, options)
      {
        current.play();
        isIn = true;
      },
      end: function(event, options)
      {
        var len = tracks.length;
        for (var i = 0; i < len; i++)
        {
          tracks[i].pause();
        }
        isIn = false;
      }
    };
  });
})(Popcorn);
