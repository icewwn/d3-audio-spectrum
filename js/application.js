function Application() {
  this.url = "media/sweep.mp3";
  this.audio;
  this.context;
  this.model;
  this.source;
  this.view;
}

Application.prototype.load = function() {
  var app = this;
  this.populateContext();
  this.audio = new Audio(this.context);
  this.source = this.sourceFromUrl(this.url, function() {
    app.model = new SpectrumAnalyzer(app.audio);
    app.view = new SpectrumAnalyzerView(app.model, "#spectrum_analyzer");
    app.view.update();
  });
}

Application.prototype.sourceFromUrl = function(url, callback) {
  var app = this;
  return new UrlAudioSource(this.context, url, function() { 
    app.onSourceLoaded(callback); 
  });
}

Application.prototype.sourceFromInput = function(callback) {
  var app = this;
  return new InputAudioSource(this.context, function() { 
    app.onSourceLoaded(callback); 
  });
}

Application.prototype.onSourceLoaded = function(callback) {
  document.getElementById("loading").style.display = 'none';
  document.getElementById("spectrum_analyzer").style.display = 'block';
  document.getElementById("controls").style.display = 'inline';
  this.audio.source = this.source;
  if (callback != null) {
    callback();
  }
}

Application.prototype.play = function() {
  document.getElementById("loader").style.display = 'block';
  this.model.play(function() {
    document.getElementById("loader").style.display = 'none';
  });
}

Application.prototype.setVolume = function(element) {
  var fraction = parseInt(element.value) / parseInt(element.max);
  var value = fraction * fraction;
  this.audio.setVolume(value);  
}

Application.prototype.setResolution = function(element) {
  this.model.setResolution(48/element.value);  
  this.view.reset();
}

Application.prototype.setCurve = function(element) {
  this.model.setCurve(element.value);  
  this.view.reset();
}

Application.prototype.toggleInput = function() {
  var app = this;
  var element = document.getElementById('input');
  var callback = function() { app.play(); };
  this.stop();
  if (this.source instanceof UrlAudioSource) {
    element.value = "Use Audio File";
    this.source = this.sourceFromInput(callback);
    console.log(this.source)
  } else if (this.source instanceof InputAudioSource) {
    element.value = "Use Audio Input";
    this.source = this.sourceFromUrl(this.url, callback);
  }
}

Application.prototype.togglePlay = function() {
  var element = document.getElementById('play');
  if (this.audio.playing) { 
    this.audio.stop();
    element.value = "Play";
  } else { 
    this.play(); 
    element.value = "Stop";
  }
}

Application.prototype.stop = function() { 
  this.audio.stop();
}

Application.prototype.populateContext = function() {
  if (! window.AudioContext) {
	  if (! window.webkitAudioContext) {
      alert("Sorry, your browser is not supported.");
      return;
		}
		window.AudioContext = window.webkitAudioContext;
    this.context = new AudioContext();
  }
}

// Class Methods

Application.load = function() {
  this.instance = new Application();
  this.instance.load();
}

Application.play = function() {
  this.instance.play();
}

Application.setVolume = function(element) {
  this.instance.setVolume(element);  
}

Application.setResolution = function(element) {
  this.instance.setResolution(element);  
}

Application.setCurve = function(element) {
  this.instance.setCurve(element);  
}

Application.toggleInput = function() {
  this.instance.toggleInput();
}

Application.togglePlay = function() {
  this.instance.togglePlay();
}

Application.stop = function() { 
  this.instance.stop();
}

