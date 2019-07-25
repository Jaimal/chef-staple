/*
* videojs-a - v0.4.2 - 2015-02-06
* Copyright (c) 2015 Michael Bensoussan
* Licensed MIT
*/
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  videojs.registerPlugin('analytics', function(options) {
    var dataSetupOptions, defaultsEventsToTrack, end, error, eventCategory, eventLabel, eventsToTrack, fullscreen, loaded, parsedOptions, pause, percentsAlreadyTracked, percentsPlayedInterval, play, resize, seekEnd, seekStart, seeking, sendbeacon, timeupdate, volumeChange, fullscreen, volume;
    if (options == null) {
      options = {};
    }
    dataSetupOptions = {};
    if (this.options()["data-setup"]) {
      parsedOptions = JSON.parse(this.options()["data-setup"]);
      if (parsedOptions.analytics) {
        dataSetupOptions = parsedOptions.analytics;
      }
    }
    //defaultsEventsToTrack = ['loaded', 'percentsPlayed', 'start', 'end', 'seek', 'play', 'pause', 'resize', 'volumeChange', 'error', 'fullscreen'];
    defaultsEventsToTrack = ['loaded', 'percentsPlayed', 'start', 'end', 'seek', 'play', 'pause', 'error'];
    eventsToTrack = options.eventsToTrack || dataSetupOptions.eventsToTrack || defaultsEventsToTrack;
    percentsPlayedInterval = options.percentsPlayedInterval || dataSetupOptions.percentsPlayedInterval || 10;
    eventCategory = options.eventCategory || dataSetupOptions.eventCategory || 'Video';
    eventLabel = options.eventLabel || dataSetupOptions.eventLabel;
    options.debug = options.debug || false;
    percentsAlreadyTracked = [];
    seekStart = seekEnd = 0;
    seeking = false;
    fullscreen = this.isFullscreen();
    volume = this.muted() === true ? 0 : Math.round(100*(this.volume()));
    loaded = function() {
      if (!eventLabel) {
        eventLabel = this.currentSrc().split("/").slice(-1)[0].replace(/\.(\w{3,4})(\?.*)?$/i, '');
      }
      if (__indexOf.call(eventsToTrack, "loadedmetadata") >= 0) {
        sendbeacon('Video Playback Buffer Completed', {
          full_screen:fullscreen,
          sound:volume,
          nonInteraction:true
        });
      }
    };
    timeupdate = function() {
      var currentTime, duration, percent, percentPlayed, fullscreen, volume, _i;
      currentTime = Math.round(this.currentTime());
      duration = Math.round(this.duration());
      percentPlayed = Math.round(currentTime / duration * 100);
      fullscreen = this.isFullscreen();
      volume = this.muted() === true ? 0 : Math.round(100*(this.volume()));
      for (percent = _i = 0; _i <= 99; percent = _i += percentsPlayedInterval) {
        if (percentPlayed >= percent && __indexOf.call(percentsAlreadyTracked, percent) < 0) {
          if (__indexOf.call(eventsToTrack, "start") >= 0 && percent === 0 && percentPlayed > 0) {
            sendbeacon('Video Content Started',{
              full_screen:fullscreen,
              sound:volume,
              position: currentTime,
              total_length: duration,
              percentage_played: percentPlayed,
              nonInteraction:true
            });
          } else if (__indexOf.call(eventsToTrack, "percentsPlayed") >= 0 && percentPlayed !== 0) {
            sendbeacon('Video Content Playing', {
              full_screen:fullscreen,
              sound:volume,
              position: currentTime,
              total_length: duration,
              percentage_played: percentPlayed,
              nonInteraction:true
            });
          }
          if (percentPlayed > 0) {
            percentsAlreadyTracked.push(percent);
          }
        }
      }
      if (__indexOf.call(eventsToTrack, "seek") >= 0) {
        seekStart = seekEnd;
        seekEnd = currentTime;
        if (Math.abs(seekStart - seekEnd) > 1) {
          seeking = true;
          sendbeacon('Video Playback Seek Started',{
            full_screen:fullscreen,
            sound:volume,
            'seekStart':seekStart,
            nonInteraction:false
          });
          sendbeacon('Video Playback Seek Completed',{
            full_screen:fullscreen,
            sound:volume,
            'seekEnd':seekEnd,
            nonInteraction:false
          });
        }
      }
    };
    end = function() {
      var fullscreen, volume;
      fullscreen = this.isFullscreen();
      volume = this.muted() === true ? 0 : Math.round(100*(this.volume()));
      sendbeacon('Video Content Started', {
        full_screen:fullscreen,
        sound:volume,
        nonInteraction:true
      });
      sendbeacon('Video Playback Completed', {
        full_screen:fullscreen,
        sound:volume,
        nonInteraction:true
      });
    };
    play = function() {
      var currentTime, duration, percent, percentPlayed, fullscreen, volume;
      currentTime = Math.round(this.currentTime());
      duration = Math.round(this.duration());
      percentPlayed = Math.round(currentTime / duration * 100);
      fullscreen = this.isFullscreen();
      volume = this.muted() === true ? 0 : Math.round(100*(this.volume()));
      sendbeacon('Video Playback Started', {
        full_screen:fullscreen,
        sound:volume,
        position: currentTime,
        total_length: duration,
        percentage_played: percentPlayed,
        nonInteraction:true
      });
      seeking = false;
    };
    pause = function() {
      var currentTime, duration, percent, percentPlayed;
      currentTime = Math.round(this.currentTime());
      duration = Math.round(this.duration());
      percentPlayed = Math.round(currentTime / duration * 100);
      fullscreen = this.isFullscreen();
      if (currentTime !== duration && !seeking) {
        sendbeacon('Video Playback Paused', {
          full_screen:fullscreen,
          sound:volume,
          position: currentTime,
          total_length: duration,
          percentage_played: percentPlayed,
          nonInteraction:true
        });
      }
    };
    error = function() {
      var currentTime, duration, percent, percentPlayed, volume;
      currentTime = Math.round(this.currentTime());
      duration = Math.round(this.duration());
      percentPlayed = Math.round(currentTime / duration * 100);
      fullscreen = this.isFullscreen();
      volume = this.muted() === true ? 0 : Math.round(100*(this.volume()));
      sendbeacon('Video Playback Interrupted', {
        full_screen:fullscreen,
        sound:volume,
        position: currentTime,
        total_length: duration,
        percentage_played: percentPlayed,
        nonInteraction:true
      });
    };

    extend = function(target) {
        var sources = [].slice.call(arguments, 1);
        sources.forEach(function (source) {
            for (var prop in source) {
                target[prop] = source[prop];
            }
        });
        return target;
    }

/* Begin Not implemented */
    volumeChange = function() {
      var volume;
      volume = this.muted() === true ? 0 : this.volume();
      sendbeacon('volume change', false, volume);
    };
    resize = function() {
      sendbeacon('resize - ' + this.width() + "*" + this.height(), true);
    };
    fullscreen = function() {
      var currentTime;
      currentTime = Math.round(this.currentTime());
      if ((typeof this.isFullscreen === "function" ? this.isFullscreen() : void 0) || (typeof this.isFullScreen === "function" ? this.isFullScreen() : void 0)) {
        sendbeacon('enter fullscreen', {
          'nonInteraction':false,
          'position':currentTime
        });
      } else {
        sendbeacon('exit fullscreen', {
          'nonInteraction':false,
          'position':currentTime
        });
      }
    };
/* End Not Implemented */

    sendbeacon = function(action, properties) {
    	analytics.track(action, extend({},properties,{
        session_id: options.session_id || 00000,
        video_player: 'videojs',
      }));
    };
    this.ready(function() {
      this.on("loadedmetadata", loaded);
      this.on("timeupdate", timeupdate);
      if (__indexOf.call(eventsToTrack, "end") >= 0) {
        this.on("ended", end);
      }
      if (__indexOf.call(eventsToTrack, "play") >= 0) {
        this.on("play", play);
      }
      if (__indexOf.call(eventsToTrack, "pause") >= 0) {
        this.on("pause", pause);
      }
      if (__indexOf.call(eventsToTrack, "volumeChange") >= 0) {
        this.on("volumechange", volumeChange);
      }
      if (__indexOf.call(eventsToTrack, "resize") >= 0) {
        this.on("resize", resize);
      }
      if (__indexOf.call(eventsToTrack, "error") >= 0) {
        this.on("error", error);
      }
      if (__indexOf.call(eventsToTrack, "fullscreen") >= 0) {
        return this.on("fullscreenchange", fullscreen);
      }
    });
    return {
      'sendbeacon': sendbeacon
    };
  });

}).call(this);
