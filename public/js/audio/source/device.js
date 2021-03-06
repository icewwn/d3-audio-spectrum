/*
  Audio input device used to collect data for analysis
*/
SA.Audio.Source.Device = function(context) {
  this._source;

  this._context = context;
}

/*
  Initialize the available audio inputs and fire the given callback when finished
*/
SA.Audio.Source.Device.prototype.load = function(callback) {
  SA.Audio.Source.Device._ensureUserMediaIsInitialized();

  var input = this;
  var sourcesLoadedCallback = function(sourceInfos) {
    input._sourcesLoadedCallback(sourceInfos, callback);
  }

  MediaStreamTrack.getSources(sourcesLoadedCallback);
}

/*
  Disconnect the audio input from the spectrum analyzer and audio outputs
*/
SA.Audio.Source.Device.prototype.stop = function() {
  this.disconnect();
}

/*
  Connect the source resource to the gain node
*/
SA.Audio.Source.Device.prototype.connect = function(connector) {
  this._source.connect(connector);
}

/*
  Disconnect the source resource from the gain node
*/
SA.Audio.Source.Device.prototype.disconnect = function() {
  this._source.disconnect();
}

/*
  Initialize the given audio input and fire the callback when finished
*/
SA.Audio.Source.Device.prototype._initializeSource = function(sourceInfo, callback) {
  var args = SA.Audio.Source.Device._getSystemArgs(sourceInfo);

  var errorCallback = function(error) {
    console.log(error);
  }

  var input = this
  var streamLoadedCallback = function(stream) {
    input._streamLoadedCallback(stream, callback);
  }

  navigator.getUserMedia(args, streamLoadedCallback, errorCallback);
}

/*
  Callback that's fired when the audio input stream has finished loading
*/
SA.Audio.Source.Device.prototype._streamLoadedCallback = function(stream, callback) {
  this._source = this._context.createMediaStreamSource(stream, callback);
  callback();
}

/*
  Callback that's fired when the audio input device resources have finished loading
*/
SA.Audio.Source.Device.prototype._sourcesLoadedCallback = function(sourceInfos, callback) {
  for (var i = 0; i != sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    // return the first audio input
    if (sourceInfo.kind === "audio") {
      return this._initializeSource(sourceInfo, callback);
    }
  }
}

/*
  Get the browser getUserMedia resource
*/
SA.Audio.Source.Device._getUserMedia = function() {
  return navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
}

/*
  Ensure that the browser getUserMedia resource is initialized
*/
SA.Audio.Source.Device._ensureUserMediaIsInitialized = function() {
  if (navigator.getUserMedia == null) {
    navigator.getUserMedia = SA.Audio.Source.Device._getUserMedia();
  }
}

/*
  Get the arguments needed to initialize the audio device via getUserMedia
*/
SA.Audio.Source.Device._getSystemArgs = function(sourceInfo) {
  return {
    audio: {
      optional: [
        { sourceId: sourceInfo.id }
      ]
    }
  };
}
