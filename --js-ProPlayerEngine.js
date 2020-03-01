class ProPlayerEngine {
	constructor() {
        /*****************************************
        ************* Global Variables  ************
        *****************************************/
		this.MediaPlayer = {};
		this.media = {};
		this.obj_ProgressSlider = {};
		this.obj_SpeedSlider = {};
		this.obj_VolumeSlider = {};
		this.obj_ZoomSlider = {};
		this.PitchShifter = null;
		this.str_MediaCode = "";
		this.str_MediaType = "";
		this.b_PlayerFlipped = false;
		this.f_CurrentTime = 0;
		this.f_PlaybackRate = 1.0;
		this.f_VideoDuration = 0;
		this.f_LoopStartTime = 0;
		this.str_PosterImage = "";
		this.a_Chapters = [];
		this.b_LoopStartTimeSet = false;
		this.f_LoopEndTime = 0;
		this.b_LoopEndTimeSet = false;
		this.b_LoopingActivated = false;
		this.b_ProcessingUserPlaybackToggle = false;
		this.b_IsPlaying = false;
		this.f_CurrentPercent = 0;
		this.b_LoopIsDefined = false;
		this.b_SliderIsUpdating = false;
		this.b_LoopNeedsUpdate = false;
		this.b_PlayerIsReady = false;
		this.b_UserIsDraggingSlider = false;
		this.b_PlayOnLoad = false;
		this.f_LastProgressTime = 10000;
		this.b_RestartingLoop = false;
		this.f_Volume = 0;
		this.b_PlayedOnce = false;
		this.f_StartTime = 0;
		this.a_VideoSources = [];
		this.a_PlaybackSpeeds = [];
		this.f_StartTime = 0;
		this.f_SavedTime = 0;
		this.b_ResumePlaying = false;
		this.b_BlockProgressUpdates = false;
		this.obj_LoadedLoop = {};
		this.obj_PanZoom = {};
		this.obj_Safety = {};
		this.obj_Safety.IWillNotUseThisInPlugins = true;
		this.f_ZoomFactor = 1;
		this.b_ZoomEnabled = false;
		this.f_StartTime = 0;
		this.array_SavedZoom = "matrix(1,0,0,1,0,0)";
		this.str_SavedResolution = "";
		this.f_SavedTime = 0;
		this.b_ProcessingUserPlayback = false;
		this.b_ZoomSliderActivated = false;
		this.b_PitchShiftActivated = false;
		this.getLoopDefined = function () { return this.b_LoopIsDefined; };
		this.getLoopStart = function () { return this.f_LoopStartTime; };
		this.getLoopEnd = function () { return this.f_LoopEndTime; };
		this.initializeProPlayerEngine = function (mediaType, mediaCode, mediaStartTime, posterImage, sourcesArray, chaptersArray) {
			//console.log('initializeProPlayerEngine called');
			this.str_MediaType = mediaType;
			this.f_MediaStartTime = Math.max(mediaStartTime, 0);
			this.str_PosterImage = posterImage;
			this.str_MediaCode = mediaCode;
			this.setChaptersArray(chaptersArray);
			this.a_VideoSources = sourcesArray;
			if (this.isVimeo()) {
				this.sortSourcesArray();
			}
			this.initializeProgressSlider();
			this.initializeVolumeSlider();
			this.initializeSpeedSlider();
			this.initializeZoomSlider();
			this.initializePanZoom();
			//this.initializePlaybackSpeeds();
			this.createResolutionRadioButtons();
			//this.createPlaybackRateButtons();
			this.restorePlayerCookieSettings();
			//this is the final step. All the necessary variables have been setup.
			//Now we're going to initialize VideoJS
			this.initializePlayer();
			this.setVolumeSliderPosition(this.f_Volume);
			this.playerSetVolume(this.f_Volume);
			if (this.f_CurrentTime > 0) {
				this.playerSeekTo(this.f_CurrentTime);
			}
		};
		this.initializePlayer = function () {
			if (this.str_MediaType == 'vimeo' || this.str_MediaType == 'audio') {
				//console.log('Initializing Vimeo Player');
				theItem = new MediaElementPlayer('videoPlayer', {
					preload: 'auto',
					autoplay: false,
					poster: this.str_PosterImage,
					features: ['fullscreen'],
					success: function (mediaElement, originalNode, instance) {
						thePlayer.theEngine.MediaPlayer = instance;
						thePlayer.theEngine.media = mediaElement;
						if (!thePlayer.theEngine.b_PlayerIsReady) {
							thePlayer.theEngine.playerIsReady();
						}
					}
				});
				if (!thePlayer.isIOS() && !thePlayer.isSafari()) {
					this.PitchShifter = new PitchShifter();
				}
			}
			else if (this.str_MediaType == 'youtube') {
				theItem = new MediaElementPlayer('videoPlayer', {
					preload: 'none',
					autoplay: 0,
					poster: this.str_PosterImage,
					features: ['fullscreen'],
					success: function (mediaElement, originalNode, instance) {
						thePlayer.theEngine.MediaPlayer = instance;
						thePlayer.theEngine.media = mediaElement;
						if (!thePlayer.theEngine.b_PlayerIsReady) {
							thePlayer.theEngine.playerIsReady();
						}
					}
				});
			}
			else if (this.str_MediaType == 'facebook') {
				theItem = new MediaElementPlayer('videoPlayer', {
					preload: 'auto',
					autoplay: false,
					poster: this.str_PosterImage,
					renderers: ['facebook'],
					videoWidth: "100%",
					videoHeight: "100%",
					features: ['fullscreen'],
					success: function (mediaElement, originalNode, instance) {
						thePlayer.theEngine.MediaPlayer = instance;
						thePlayer.theEngine.media = mediaElement;
						if (!thePlayer.theEngine.b_PlayerIsReady) {
							thePlayer.theEngine.playerIsReady();
						}
					}
				});
			}
		};
		this.setChaptersArray = function (theChaptersArray) {
			if (typeof theChaptersArray !== "undefined") {
				this.a_Chapters = theChaptersArray;
				var chapterString = "";
				for (let i = 0; i < this.a_Chapters.length; i++) {
					chapterString += "<div class='chapter-marker' id='chapter-" + i + "'></div>";
				}
				$("#chapters-wrapper").html(chapterString);
			}
		};
		this.prepareForDestruction = function () {
			this.saveCookieValues();
			if (!this.MediaPlayer.paused) {
				this.MediaPlayer.pause();
			}
			$('#videoPlayer').off("play");
			$('#videoPlayer').off("pause");
			$('#videoPlayer').off("loadedmetadata");
			$('#videoPlayer').off("timeupdate");
			$('#videoPlayer').off("ended");
			$('#videoPlayer').off("error");
			$('#videoPlayer').off("canplay");
			this.MediaPlayer.remove();
			$("#mediaPlayerWrapper").remove();
			if (this.PitchShifter !== null) {
				this.PitchShifter.prepareForDestruction();
				delete this.PitchShifter;
			}
		};
		this.playerIsReady = function () {
			//console.log('playerIsReady function called.');
			//console.log('Setting Poster Image To ' + this.str_PosterImage);
			//console.log('Poster Image Is: ' + this.MediaPlayer.poster);
			// Setup callbacks
			$('#videoPlayer').on("play", function () { thePlayer.theEngine.playerPlayEventCallback(event); });
			$('#videoPlayer').on("pause", function () { thePlayer.theEngine.playerPauseEventCallback(); });
			//Plyr has no durationchanged event so trying loadstart instead.
			$('#videoPlayer').on("loadedmetadata", function () { thePlayer.theEngine.playerDurationChangedCallback(); });
			//$('#videoPlayer').on("volumechange", function(){ thePlayer.theEngine.playerVolumeChangedCallback() });
			$('#videoPlayer').on("timeupdate", function () { thePlayer.theEngine.playerTimeUpdateCallback(); });
			$('#videoPlayer').on("ended", function () { thePlayer.theEngine.playerEndCallback(); });
			$('#videoPlayer').on("error", function (event) { thePlayer.theEngine.playerErrorCallback(event); });
			$('#videoPlayer').on("canplay", function () { thePlayer.theEngine.playerSourceDataChanged(); });
			//Duration changed callback doesn't fire for audio, so set the duration here.
			this.f_VideoDuration = this.MediaPlayer.duration;
			if (this.str_MediaType == 'youtube') {
				//this.MediaPlayer.setSrc( "https://youtube.com/watch?v=" + this.str_MediaCode );
				//this.MediaPlayer.load();
				this.refreshChapterMarkerPositions();
				if (this.b_PlayerFlipped) {
					this.setPlayerFlipped(true);
				}
				$("iframe").bind("contextmenu", function () { return false; });
				$(".mejs__mediaelement").bind("contextmenu", function () { return false; });
			}
			else if (this.str_MediaType == 'facebook') {
				//console.log('Setting Facebook Source: https://facebook.com/' + this.str_MediaCode);
				//this.MediaPlayer.setSrc( "https://facebook.com/" + this.str_MediaCode );
				this.MediaPlayer.load();
				this.refreshChapterMarkerPositions();
				if (this.b_PlayerFlipped) {
					this.setPlayerFlipped(true);
				}
				$("iframe").bind("contextmenu", function () { return false; });
				$(".mejs__mediaelement").bind("contextmenu", function () { return false; });
			}
			else if (this.str_MediaType == 'vimeo') {
				this.selectInitialSource();
				if (this.b_PlayerFlipped) {
					this.setPlayerFlipped(true);
				}
				$("video").bind("contextmenu", function () { return false; });
				$(".mejs__mediaelement").bind("contextmenu", function () { return false; });
			}
			this.playerSetVolume(this.f_Volume);
			this.updateTransportButtons();
			this.b_PlayerIsReady = true;
		};
		this.initializeProgressSlider = function () {
			//console.log('initializeProgressSlider called');
			/***** Initialize Progress Slider *****/
			this.obj_ProgressSlider = document.getElementById('progressSlider');
			noUiSlider.create(this.obj_ProgressSlider, {
				animate: false,
				start: [0],
				range: {
					'min': 0,
					'max': 1000
				}
			});
			this.obj_ProgressSlider.noUiSlider.on('slide', function () { thePlayer.theEngine.progressSliderSliding(); });
			this.obj_ProgressSlider.noUiSlider.on('change', function () { thePlayer.theEngine.progressSliderChanged(); });
		};
		this.initializeVolumeSlider = function () {
			//console.log('initializeVolumeSlider called');
			/***** Initialize Volume Slider *****/
			this.obj_VolumeSlider = document.getElementById('volumeSlider');
			noUiSlider.create(this.obj_VolumeSlider, {
				animate: false,
				start: 1,
				step: .005,
				connect: [true, false],
				orientation: 'horizontal',
				direction: 'ltr',
				range: {
					'min': 0,
					'max': 1
				}
			});
			this.obj_VolumeSlider.noUiSlider.on('slide', function () { thePlayer.theEngine.volumeSliderChanged(); });
		};
		this.initializeZoomSlider = function () {
			if (this.str_MediaType !== 'audio') {
				/***** Initialize Zoom Slider *****/
				this.obj_ZoomSlider = document.getElementById('zoomSlider');
				noUiSlider.create(this.obj_ZoomSlider, {
					animate: false,
					start: 1,
					step: .005,
					connect: [true, false],
					orientation: 'horizontal',
					direction: 'ltr',
					range: {
						'min': 1,
						'max': 4
					}
				});
				this.obj_ZoomSlider.noUiSlider.on('slide', function () { thePlayer.theEngine.zoomSliderChanged(); });
				//disable zoom until user enables it
				$(this.obj_ZoomSlider).attr('disabled', true);
			}
		};
		this.initializePanZoom = function () {
			//console.log('initializePanZoom called');
			if (this.str_MediaType != "audio") {
				//setup the panzoom object.
				this.obj_PanZoom = $('#mediaPanZoomWrapper');
				this.obj_PanZoom.panzoom({
					contain: 'invert',
					minScale: 1,
					maxScale: 4,
					increment: .005,
					startTransform: "none"
				});
				this.b_ZoomEnabled = false;
				//console.log('Setting Panzoom transform...');
				this.obj_PanZoom.panzoom("enable");
				this.obj_PanZoom.panzoom("setTransform", "matrix(1,0,0,1,0,0)");
				this.obj_PanZoom.panzoom("disable");
				$(this.obj_ZoomSlider).attr('disabled', true);
				//setup the scroll wheel callback
				$(this.obj_PanZoom).parent().on('mousewheel.focal', function (event) {
					if (thePlayer.theEngine.b_ZoomEnabled) {
						event.preventDefault();
						var delta = event.delta || event.originalEvent.wheelDelta;
						var zoomOut = delta ? delta < 0 : event.originalEvent.deltaY > 0;
						//console.log("Doing mousewheel panzoom");
						thePlayer.theEngine.obj_PanZoom.panzoom('zoom', zoomOut, {
							increment: -0.1,
							animate: true,
							focal: event,
							linearZoom: true,
							rangeStep: .01,
							duration: 500
						});
					}
				});
				$(this.obj_PanZoom).on("panzoomzoom", function (e, panzoom) {
					thePlayer.theEngine.syncZoomSliderPosition();
				});
			}
			else {
				$(this.obj_ZoomSlider).attr('disabled', true);
				$('#enableZoom').attr('disabled', true);
			}
		};
        /*****************************************
        *************  Engine Setters & Getters  ************
        *****************************************/
		this.setIsPlaying = function (newValue) {
			//console.log("setIsPlaying: " + newValue);
			this.b_IsPlaying = newValue;
			thePlayer.enginePlaybackToggled(newValue);
		};
		this.isPlaying = function () {
			return this.b_IsPlaying;
		};
		this.isVimeo = function () {
			return this.str_MediaType == "vimeo";
		};
		this.isAudio = function () {
			return this.str_MediaType == "audio";
		};
		this.isYoutube = function () {
			return this.str_MediaType == "youtube";
		};
		this.togglePitchShiftActivated = function () {
			if (this.PitchShifter !== null && !thePlayer.isIOS() && !thePlayer.isSafari()) {
				if (this.b_PitchShiftActivated) {
					console.log("Disconnecting pitch shifter");
					this.PitchShifter.disconnectVideo();
					this.b_PitchShiftActivated = false;
				}
				else {
					console.log("Activating pitch shifter");
					this.PitchShifter.initVideoObservers();
					this.b_PitchShiftActivated = true;
				}
			}
		};
		this.toggleZoomEnabled = function () {
			//console.log('Toggling zoom enabled...');
			if (this.b_ZoomEnabled) {
				this.array_SavedZoom = this.obj_PanZoom.panzoom("getTransform");
				this.obj_PanZoom.panzoom("setTransform", "matrix(1,0,0,1,0,0)");
				this.obj_PanZoom.panzoom("disable");
				$(this.obj_ZoomSlider).attr('disabled', true);
				$("#videoPlayer").toggleClass('clickDisabled', false);
				$('#mediaPlayerWrapper').toggleClass('zoomed', false);
				$('#enableZoom').prop('checked', false);
				this.b_ZoomEnabled = false;
			}
			else {
				//console.log("Toggling zoom ON");
				this.obj_PanZoom.panzoom("enable");
				this.b_ZoomEnabled = true;
				$('#enableZoom').prop('checked', true);
				$("#videoPlayer").toggleClass('clickDisabled', true);
				$(this.obj_ZoomSlider).removeAttr('disabled');
				$('#mediaPlayerWrapper').toggleClass('zoomed', true);
				this.obj_PanZoom.panzoom("setTransform", this.array_SavedZoom);
				this.syncZoomSliderPosition();
			}
		};
		this.sortSourcesArray = function () {
			//first we'll filter out the HLS source for everything but iOS, but filter
			//out everything else for iOS.
			newArray = [];
			for (let i = 0; i < this.a_VideoSources.length; ++i) {
				if (thePlayer.isIOS()) {
					if (this.a_VideoSources[i]["resolution"] == "Auto") {
						//newSource = this.a_VideoSources[i];
						//newArray.push( newSource );
					}
					else {
						newSource = this.a_VideoSources[i];
						if (newSource["resolution"] == "720" || newSource["resolution"] == "720p60" || newSource["resolution"] == "1080" || newSource["resolution"] == "1080p60") {
							newSource["hd"] = "hd";
						}
						else {
							newSource["hd"] = "";
						}
						newArray.push(newSource);
					}
				}
				else {
					if (this.a_VideoSources[i]["resolution"] != "Auto") {
						newSource = this.a_VideoSources[i];
						if (newSource["resolution"] == "720" || newSource["resolution"] == "720p60" || newSource["resolution"] == "1080" || newSource["resolution"] == "1080p60") {
							newSource["hd"] = "hd";
						}
						else {
							newSource["hd"] = "";
						}
						newArray.push(newSource);
					}
				}
			}
			//Now we have an array of sources that only contains the sources
			//appropriate for this platform.
			this.a_VideoSources = newArray;
			//Now, if we're not on iOS, scan through the sources and add p60 
			//where necessary.
			this.a_VideoSources.sort(function (a, b) { return b["size"] - a["size"]; });
			for (let i = 1; i < this.a_VideoSources.length; ++i) {
				var src1 = this.a_VideoSources[i];
				var src2 = this.a_VideoSources[i - 1];
				if (src1["resolution"] == src2["resolution"]) {
					if (src1["size"] > src2["size"]) {
						src1["resolution"] += "p60";
					}
					else {
						src2["resolution"] += "p60";
					}
				}
			}
		};
		this.selectInitialSource = function () {
			var srcURL = "";
			var selectedSourceIndex = 0;
			if (this.str_SavedResolution != "") {
				for (let i = 0; i < this.a_VideoSources.length; ++i) {
					if (this.str_SavedResolution == this.a_VideoSources[i]["resolution"]) {
						srcURL = this.a_VideoSources[i]["url"];
						selectedSourceIndex = i;
						break;
					}
				}
				//if we couldn't find an exact match, find the next closest
				if (srcURL == "") {
					for (let i = 0; i < this.a_VideoSources.length; ++i) {
						//trim off p60
						strBaseResolution = this.str_SavedResolution.toString().substring(0, 3);
						strSourceResolution = this.a_VideoSources[i]["resolution"];
						if (strSourceResolution.search(strBaseResolution) > -1) {
							srcURL = this.a_VideoSources[i]["url"];
							selectedSourceIndex = i;
							break;
						}
					}
				}
				//if we still didn't find a match, default to the lowest
				if (srcURL == "") {
					srcURL = this.a_VideoSources[this.a_VideoSources.length - 1]["url"];
					selectedSourceIndex = this.a_VideoSources.length - 1;
				}
			}
			else {
				srcURL = this.a_VideoSources[this.a_VideoSources.length - 1]["url"];
				selectedSourceIndex = this.a_VideoSources.length - 1;
			}
			this.playerSetActiveSource(selectedSourceIndex);
		};
		this.loadYTSourcesArray = function () {
			//console.log("loadYTSourcesArray called.");
			return;
            /*
            if( this.isYoutube() )
            {
                var videoQualities = this.MediaPlayer.sources;//tech(this.obj_Safety).ytPlayer.getAvailableQualityLevels();
                var iResolutionIndex = 0;
                for(let i = 0; i < videoQualities.length; i++)
                {
                    //console.log("Found YT Quality named: " + videoQualities[i]);
                    var sourceObject = {};
                    var resolutionString = this.convertYTString( videoQualities[i] )
                    if( resolutionString != '144' && resolutionString != '240')
                    {
                        sourceObject["resolution"] = resolutionString;
                        if(resolutionString == "720" || resolutionString == "720p60" || resolutionString == "1080" || resolutionString == "1080p60")
                        {
                            sourceObject["hd"] = "hd";
                        }
                        else
                        {
                            sourceObject["hd"] = "";
                        }
                        this.a_VideoSources[iResolutionIndex] = sourceObject;
                        iResolutionIndex++;
                    }
                }
            }
            */
		};
		this.initializeSpeedSlider = function () {
			if (this.str_MediaType == 'vimeo' || this.str_MediaType == 'audio') {
				//console.log('initializeSpeedSlider called');
				/***** Initialize Volume Slider *****/
				this.obj_SpeedSlider = document.getElementById('speedSlider');
				noUiSlider.create(this.obj_SpeedSlider, {
					animate: false,
					start: 1,
					step: .1,
					connect: [true, false],
					orientation: 'horizontal',
					direction: 'ltr',
					range: {
						'min': .3,
						'max': 1.5
					}
				});
				this.obj_SpeedSlider.noUiSlider.on('slide', function () { thePlayer.theEngine.speedSliderChanged(); });
			}
			else if (this.str_MediaType == 'youtube') {
				this.obj_SpeedSlider = document.getElementById('speedSlider');
				noUiSlider.create(this.obj_SpeedSlider, {
					animate: false,
					start: 1,
					step: .25,
					connect: [true, false],
					orientation: 'horizontal',
					direction: 'ltr',
					range: {
						'min': .25,
						'max': 1.5
					}
				});
				this.obj_SpeedSlider.noUiSlider.on('slide', function () { thePlayer.theEngine.speedSliderChanged(); });
			}
			else if (this.str_MediaType == 'youtube') {
				//Facebook doesn't support slowing down of videos yet.
			}
		};
        /*
        this.initializePlaybackSpeeds()
        {
            if( this.str_MediaType == 'vimeo' || this.str_MediaType == 'audio')
            {
                var speedItem = {};
                
                speedItem["label"] = "125%";
                speedItem["factor"] = 1.25;
                this.a_PlaybackSpeeds[0] = speedItem;
                
                speedItem = {};
                speedItem["label"] = "100%";
                speedItem["factor"] = 1.0;
                this.a_PlaybackSpeeds[1] = speedItem;
                speedItem = {};
                speedItem["label"] = "85%";
                speedItem["factor"] = .85;
                this.a_PlaybackSpeeds[2] = speedItem;
                speedItem = {};
                speedItem["label"] = "75%";
                speedItem["factor"] = .75;
                this.a_PlaybackSpeeds[3] = speedItem;
                speedItem = {};
                speedItem["label"] = "60%";
                speedItem["factor"] = .6;
                this.a_PlaybackSpeeds[4] = speedItem;
                speedItem = {};
                speedItem["label"] = "50%";
                speedItem["factor"] = .5;
                this.a_PlaybackSpeeds[5] = speedItem;
                speedItem = {};
                speedItem["label"] = "25%";
                speedItem["factor"] = .25;
                this.a_PlaybackSpeeds[6] = speedItem;
            }
            else if( this.str_MediaType == 'youtube')
            {
                speedItem = {};
                speedItem["label"] = "150%";
                speedItem["factor"] = 1.5;
                this.a_PlaybackSpeeds[0] = speedItem;
                speedItem = {};
                speedItem["label"] = "125%";
                speedItem["factor"] = 1.25;
                this.a_PlaybackSpeeds[1] = speedItem;
                speedItem = {};
                speedItem["label"] = "100%";
                speedItem["factor"] = 1.0;
                this.a_PlaybackSpeeds[2] = speedItem;
                speedItem = {};
                speedItem["label"] = "75%";
                speedItem["factor"] = .75;
                this.a_PlaybackSpeeds[3] = speedItem;
                speedItem = {};
                speedItem["label"] = "50%";
                speedItem["factor"] = .5;
                this.a_PlaybackSpeeds[4] = speedItem;
                speedItem = {};
                speedItem["label"] = "25%";
                speedItem["factor"] = .25;
                this.a_PlaybackSpeeds[5] = speedItem;
            }
        }
        */
        /*****************************************
        *************  Callback Functions   ************
        *****************************************/
		this.playerPauseEventCallback = function () {
			//console.log('playerPauseEventCallback called.');
			//console.log('Proccesing user input is ' + this.b_ProcessingUserPlaybackToggle);
			if (!this.b_ProcessingUserPlaybackToggle) {
				this.setIsPlaying(false);
			}
			else {
				this.b_ProcessingUserPlaybackToggle = false;
			}
			this.updateTransportButtons();
		};
		this.playerPlayEventCallback = function (event) {
			if (!this.b_PlayedOnce) {
				this.refreshChapterMarkerPositions();
				this.updateSelectedSpeed();
				this.updateSelectedResolution();
				this.b_PlayedOnce = true;
			}
			if (!this.b_ProcessingUserPlaybackToggle) {
				this.setIsPlaying(true);
			}
			else {
				this.b_ProcessingUserPlaybackToggle = false;
			}
			this.updateTransportButtons();
			// Only used for videos with a hard coded start time that is not 0;
			if (this.isPlaying() && this.f_CurrentTime < this.f_StartTime) {
				this.playerSeekTo(this.f_StartTime);
			}
		};
		this.playerDurationChangedCallback = function () {
			//console.log('playerDurationChangedCallback called.');
			this.f_VideoDuration = this.MediaPlayer.duration;
			this.refreshChapterMarkerPositions();
		};
		this.playerVolumeChangedCallback = function () {
            /*
            //console.log("playerVolumeChangedCallback called.");
            this.f_Volume = this.MediaPlayer.volume;
            this.setVolumeSliderPosition(this.f_Volume);
            //console.log("Saving Volume During Callback: " + this.f_Volume);
            localStorage.setItem('proPlayerVolume', this.f_Volume);
            */
			//Why would we take volume changes from the player?
		};
		this.playerTimeUpdateCallback = function () {
			//console.log("timeUpdateCalled");
			if (!this.b_BreakProgressUpdates && !this.b_UserIsDraggingSlider) {
				if (!this.b_RestartingLoop) {
					this.f_CurrentTime = this.MediaPlayer.currentTime;
					this.f_VideoDuration = this.MediaPlayer.duration;
					this.f_CurrentPercent = this.f_CurrentTime / this.f_VideoDuration;
					this.obj_ProgressSlider.noUiSlider.set(this.f_CurrentPercent * 1000);
					$('#current-time').html(this.secondsToMinutes(this.f_CurrentTime));
					if (this.f_VideoDuration > 0) {
						$('#time-left').html(this.secondsToMinutes(this.f_VideoDuration - this.f_CurrentTime));
					}
					if (this.b_LoopIsDefined) {
						if (this.b_LoopNeedsUpdate) {
							this.f_LoopStartTimePercent = (this.f_LoopStartTime / this.f_VideoDuration) * 100;
							this.f_LoopEndTimePercent = (this.f_LoopEndTime / this.f_VideoDuration) * 100;
							loopWidth = Math.max(.1, this.f_LoopEndTimePercent - this.f_LoopStartTimePercent);
							$('#loop-region').css('left', this.f_LoopStartTimePercent.toString() + '%');
							$('#loop-region').css('width', loopWidth.toString() + '%');
							this.b_LoopNeedsUpdate = false;
						}
						if (this.b_LoopingActivated && this.f_CurrentTime >= this.f_LoopEndTime) {
							this.b_RestartingLoop = true;
							currentRate = this.media.getPlaybackRate();
							this.playerSeekTo(this.f_LoopStartTime);
							this.media.setPlaybackRate(currentRate);
							this.b_RestartingLoop = false;
						}
					}
				}
				else {
					//console.log('Time Update Skipped, Step 2');
				}
			}
			else {
				//console.log('Time Update Skipped, Step 1');
			}
		};
		this.playerEndCallback = function () {
			//console.log('playerEndCallback called');
			var savedPlaybackPositions = JSON.parse(localStorage.getItem('proPlayerPlaybackLocations'));
			if (savedPlaybackPositions !== null) {
				var removeIndex = -1;
				for (let i = 0; i < savedPlaybackPositions.length; i++) {
					if (savedPlaybackPositions[i].mediaCode == this.str_MediaCode) {
						removeIndex = i;
						break;
					}
				}
				if (removeIndex > -1) {
					savedPlaybackPositions.splice(removeIndex, 1);
				}
				localStorage.setItem('proPlayerPlaybackLocations', JSON.stringify(savedPlaybackPositions));
			}
			this.f_CurrentTime = 0;
			this.playerSeekTo(this.f_CurrentTime);
			this.updateTransportButtons();
		};
		this.playerErrorCallback = function (event) {
			//console.log('playerErrorCallback called');
			//console.log(event);
			//		errorMessage = this.MediaPlayer.error;
            /*if(errorMessage.code == 4)
            {
                alert("The video could not be loaded. This is probably an error with our video hosting service. If this continues to happen, please let us know through the support page at http://texasbluesalley.com/hq/support");
            }
            else if (errorMessage.code == 3)
            {
                alert("Looks like there's been an error playing the video. This error happens frequently in Internet Explorer (or Edge) on Window 10 systems. We recommend Google Chrome or Firefox for a better experience.");
            }*/
		};
		this.vimeoLoadingError = function () {
			alert("The video could not be loaded. This is probably an error with our video hosting service. If this continues to happen, please let us know through the support page at http://texasbluesalley.com/hq/support");
		};
        /*****************************************
        ******   Progress Slider Functions  ******
        *****************************************/
		this.progressSliderSliding = function () {
			//console.log('progressSliderSliding called');
			this.b_UserIsDraggingSlider = true;
		};
		this.progressSliderChanged = function () {
			//console.log('progressSliderChanged called');
			this.b_UserIsDraggingSlider = false;
			sliderValue = this.obj_ProgressSlider.noUiSlider.get();
			this.f_CurrentPercent = sliderValue / 1000;
			this.f_CurrentTime = this.f_VideoDuration * this.f_CurrentPercent;
			this.playerSeekTo(this.f_CurrentTime);
		};
        /*****************************************
        *****	Control Button Callbacks	 *****
        *****************************************/
		this.onButtonPlaybackRestart = function () {
			//console.log('onButtonPlaybackRestart called');
			if (this.isPlaying() && !this.b_LoopingActivated) {
				this.playerSeekTo(this.f_StartTime);
				this.b_LoopingActivated = false;
			}
		};
		this.onButtonPlaybackRewindPoint5 = function () {
			if (this.isPlaying()) {
				var newTime = this.f_CurrentTime - .5;
				if (this.b_LoopingActivated) {
					newTime = Math.max(newTime, this.f_LoopStartTime);
				}
				newTime = Math.max(newTime, 0);
				this.playerSeekTo(newTime);
			}
		};
		this.onButtonPlaybackForwardPoint5 = function () {
			if (this.isPlaying()) {
				var newTime = this.f_CurrentTime + .5;
				if (this.b_LoopingActivated) {
					newTime = Math.min(newTime, this.f_LoopEndTime);
				}
				newTime = Math.min(newTime, this.f_VideoDuration);
				this.playerSeekTo(newTime);
			}
		};
		this.onButtonPlaybackRewind1 = function () {
			if (this.isPlaying()) {
				var newTime = this.f_CurrentTime - 1;
				if (this.b_LoopingActivated) {
					newTime = Math.max(newTime, this.f_LoopStartTime);
				}
				newTime = Math.max(newTime, 0);
				this.playerSeekTo(newTime);
			}
		};
		this.onButtonPlaybackForward1 = function () {
			//console.log('onButtonPlaybackForward1 called');
			if (this.isPlaying()) {
				var newTime = this.f_CurrentTime + 1;
				if (this.b_LoopingActivated) {
					newTime = Math.min(newTime, this.f_LoopEndTime);
				}
				newTime = Math.min(newTime, this.f_VideoDuration);
				this.playerSeekTo(newTime);
			}
		};
		this.onButtonPlaybackRewind5 = function () {
			if (this.isPlaying()) {
				var newTime = this.f_CurrentTime - 5;
				if (this.b_LoopingActivated) {
					newTime = Math.max(newTime, this.f_LoopStartTime);
				}
				newTime = Math.max(newTime, 0);
				this.playerSeekTo(newTime);
			}
		};
		this.onButtonPlaybackForward5 = function () {
			//console.log('onButtonPlaybackForward1 called');
			if (this.isPlaying()) {
				var newTime = this.f_CurrentTime + 5;
				if (this.b_LoopingActivated) {
					newTime = Math.min(newTime, this.f_LoopEndTime);
				}
				newTime = Math.min(newTime, this.f_VideoDuration);
				this.playerSeekTo(newTime);
			}
		};
		this.onButtonTogglePlayback = function () {
			//console.log('onButtonTogglePlayback called.');
			this.b_ProcessingUserPlaybackToggle = true;
			if (!this.isPlaying()) {
				this.setIsPlaying(true);
				this.playerPlay();
			}
			else {
				this.setIsPlaying(false);
				this.playerPause();
			}
			this.updateTransportButtons();
		};
		this.stopPlayback = function () {
			if (this.isPlaying()) {
				this.onButtonTogglePlayback();
			}
		};
		this.startPlayback = function () {
			if (!this.isPlaying()) {
				this.onButtonTogglePlayback();
			}
		};
		this.onButtonRestartLoop = function () {
			if (this.b_LoopIsDefined && this.b_LoopingActivated) {
				this.playerSeekTo(this.f_LoopStartTime);
			}
		};
		this.onButtonSetLoopStart = function () {
			//console.log('onButtonSetLoopStart called');
			if (!this.b_LoopingActivated) {
				this.f_LoopStartTime = this.f_CurrentTime.toFixed(3);
				if (this.f_CurrentTime > this.f_LoopEndTime) {
					this.b_LoopIsDefined = false;
					this.b_LoopEndTimeSet = false;
				}
				else {
					this.b_LoopIsDefined = this.b_LoopEndTimeSet;
				}
				this.b_LoopStartTimeSet = true;
				this.f_LoopEndTime = this.f_LoopEndTime > this.f_LoopStartTime ? this.f_LoopEndTime : Math.min(this.f_LoopStartTime + 1, this.f_VideoDuration);
				this.b_LoopNeedsUpdate = true;
				this.updateTransportButtons();
				thePlayer.engineLoopHasChanged();
			}
		};
		this.onButtonSetLoopEnd = function () {
			//console.log('onButtonSetLoopEnd called');
			if (!this.b_LoopingActivated) {
				this.f_LoopEndTime = this.f_CurrentTime.toFixed(3);
				if (this.f_CurrentTime <= this.f_LoopStartTime) {
					this.b_LoopIsDefined = false;
					this.b_LoopStartTimeSet = false;
				}
				else {
					this.b_LoopIsDefined = this.b_LoopStartTimeSet;
				}
				this.b_LoopEndTimeSet = true;
				this.f_LoopStartTime = this.f_LoopStartTime < this.f_LoopEndTime ? this.f_LoopStartTime : Math.max(0, this.f_LoopEndTime - 1);
				this.b_LoopNeedsUpdate = true;
				this.updateTransportButtons();
				thePlayer.engineLoopHasChanged();
			}
		};
		this.onButtonToggleLooping = function () {
			if (this.b_LoopIsDefined) {
				if (this.b_LoopingActivated) {
					this.b_LoopingActivated = false;
				}
				else {
					if (!this.isPlaying()) {
						this.onButtonTogglePlayback();
					}
					if (this.f_LoopStartTime < this.f_LoopEndTime && this.b_LoopIsDefined) {
						this.b_LoopingActivated = true;
						this.playerSeekTo(this.f_LoopStartTime);
					}
				}
				this.updateTransportButtons();
			}
		};
		this.stopLooping = function () {
			this.b_LoopIsDefined = 0;
			this.b_LoopingActivated = false;
			this.updateTransportButtons();
		};
        /************************************************************
        *************   Playback Rate Keyboard Callbacks  ************
        ************************************************************/
		this.decreasePlaybackRate = function () {
			var currentRate = this.media.getPlaybackRate();
			if (currentRate > .25) {
				if (currentRate == 1.25) {
					if (this.str_MediaType == 'youtube') {
						currentRate = 1.0;
					}
					else {
						currentRate = 1.0;
					}
				}
				else if (currentRate == 1.0) {
					currentRate = .85;
				}
				else if (currentRate == .85) {
					currentRate = .75;
				}
				else if (currentRate == .75) {
					currentRate = .6;
				}
				else if (currentRate == .60) {
					currentRate = .5;
				}
				else if (currentRate == .50) {
					currentRate = .25;
				}
				this.media.setPlaybackRate(currentRate);
				this.updateSelectedSpeed();
			}
		};
		this.increasePlaybackRate = function () {
			var currentRate = this.media.getPlaybackRate();
			if (currentRate < 1.25) {
				if (currentRate == 1.0) {
					currentRate = 1.25;
				}
				else if (currentRate == .85) {
					currentRate = 1.0;
				}
				else if (currentRate == .75) {
					currentRate = .85;
				}
				else if (currentRate == .60) {
					currentRate = .75;
				}
				else if (currentRate == .5) {
					if (this.str_MediaType == 'youtube') {
						currentRate = 1;
					}
					else {
						currentRate = .60;
					}
				}
				else if (currentRate == .25) {
					currentRate = .5;
				}
				this.media.setPlaybackRate(currentRate);
				this.updateSelectedSpeed();
			}
		};
        /*****************************************
        ******	Bookmarking and Looping	 *********
        *****************************************/
		this.goToChapter = function (timeStart) {
			//console.log("goToChapter called: " + timeStart);
			if (!this.isPlaying()) {
				this.onButtonTogglePlayback();
			}
			if (this.b_LoopingActivated) {
				this.onButtonToggleLooping();
			}
			this.playerSeekTo(timeStart);
			this.updateTransportButtons();
		};
		this.loadLoop = function (timeStart, timeStop) {
			//console.log("loadLoop called: " + timeStart + ", " + timeStop);
			if (!this.isPlaying()) {
				this.onButtonTogglePlayback();
			}
			this.b_LoopIsDefined = true;
			this.b_LoopNeedsUpdate = true;
			this.b_LoopingActivated = true;
			this.f_LoopStartTime = timeStart;
			this.f_LoopEndTime = Math.max(timeStop, this.f_LoopStartTime + .1);
			this.updateTransportButtons();
			if (this.f_LoopStartTime > this.f_CurrentTime) {
				this.playerSeekTo(this.f_LoopStartTime);
			}
			else if (this.f_LoopEndTime < this.f_CurrentTime) {
				this.playerSeekTo(this.f_LoopStartTime);
			}
		};
        /*****************************************
        ******	Direct Player Functions	**********
        *****************************************/
		this.playerSeekTo = function (value) {
			//console.trace();
			//console.log('playerSeekTo: ' + value);
			this.MediaPlayer.setCurrentTime(value);
		};
		this.playerPlay = function () {
			//console.log('playerPlay called.');
			this.setIsPlaying(true);
			this.MediaPlayer.play();
		};
		this.playerPause = function () {
			//console.log('playerPause called.');
			this.setIsPlaying(false);
			this.MediaPlayer.pause();
		};
		this.playerSetVolume = function (value) {
			//console.log('playerSetVolume:' + value);
			this.MediaPlayer.volume = value;
		};
		this.playerSetActiveSource = function (sourceIndex) {
			if (!this.isYoutube()) {
				var theSource = this.a_VideoSources[sourceIndex];
				var newSource = {
				type: "video",
					sources: [
						{
							src: theSource.url,
							type: 'video/mp4',
						},
					],
					poster: this.str_PosterImage,
				};
				this.media.setSrc(theSource.url);
				this.media.load();
			}
			;
		};
        /*****************************************
        ********	Interface Status	**********
        *****************************************/
		this.stopIfPlaying = function () {
			if (this.isPlaying()) {
				this.onButtonTogglePlayback();
			}
		};
		this.updateTransportButtons = function () {
			//console.log('updateTransportButtons called.');
			$('#playback-play').prop('disabled', false);
			if (this.isPlaying()) {
				$('#playback-play').html('<i class="fa fa-pause"></i>');
			}
			else {
				$('#playback-play').html('<i class="fa fa-play"></i>');
			}
			$('#playback-beginning').prop('disabled', !this.isPlaying() || this.b_LoopingActivated);
			$('#playback-rewind').prop('disabled', !this.isPlaying());
			$('#playback-forward').prop('disabled', !this.isPlaying());
			$('#looping-start').prop('disabled', this.b_LoopingActivated);
			$('#looping-start').toggleClass('set', this.b_LoopStartTimeSet);
			$('#looping-stop').prop('disabled', this.b_LoopingActivated);
			$('#looping-stop').toggleClass('set', this.b_LoopEndTimeSet);
			$('#looping-toggle').prop('disabled', !(this.isPlaying() && this.b_LoopIsDefined));
			$('#loop-region').toggle(this.b_LoopIsDefined);
			$('#progressSlider').toggleClass('looping', this.b_LoopingActivated);
			if (this.b_LoopIsDefined) {
				if (this.b_LoopNeedsUpdate) {
					this.f_LoopStartTimePercent = (this.f_LoopStartTime / this.f_VideoDuration) * 100;
					this.f_LoopEndTimePercent = (this.f_LoopEndTime / this.f_VideoDuration) * 100;
					loopWidth = Math.max(.1, this.f_LoopEndTimePercent - this.f_LoopStartTimePercent);
					$('#loop-region').css('left', this.f_LoopStartTimePercent.toString() + '%');
					$('#loop-region').css('width', loopWidth.toString() + '%');
					this.b_LoopNeedsUpdate = false;
				}
			}
			$('#looping-toggle').toggleClass('engaged', this.b_LoopingActivated);
			if (this.b_LoopingActivated && this.isPlaying()) {
				$('#looping-toggle').html('<i class="fa fa-spin fa-refresh"></i>');
			}
			else {
				$('#looping-toggle').html('<i class="fa fa-refresh"></i>');
			}
		};
		this.refreshChapterMarkerPositions = function () {
			//console.log('refreshChapterMarkerPositions called.');
			if (this.f_VideoDuration > 0) {
				var chapterDivs = $('.chapter-marker');
				for (let i = 0; i < chapterDivs.length; i++) {
					var leftPercent = (this.a_Chapters[i][1] / this.f_VideoDuration) * 100;
					$(chapterDivs[i]).css('left', leftPercent.toString() + '%');
				}
				;
			}
			else {
			}
		};
		this.setPlayerSpeed = function (speed) {
			var desiredSpeed = parseFloat(speed);
			var theSpeed = Math.max(.25, desiredSpeed);
			theSpeed = Math.min(1.5, theSpeed);
			this.f_PlaybackRate = theSpeed;
			this.media.setPlaybackRate(this.f_PlaybackRate);
		};
		this.restorePlaybackRate = function () {
			//this function is used to set the player back to the playback rate that was last selected
			//after pitch shifting is turned on.
			console.log("Original playback rate is: " + this.f_PlaybackRate);
			this.setPlayerSpeed(this.f_PlaybackRate);
		};
		this.volumeSliderChanged = function () {
			var sliderValue = this.obj_VolumeSlider.noUiSlider.get();
			//console.log('volumeSliderChanged called.');
			var theVolume = Math.max(0, sliderValue);
			theVolume = Math.min(1, theVolume);
			this.f_Volume = theVolume;
			this.playerSetVolume(this.f_Volume);
			localStorage.setItem('proPlayerVolume', this.f_Volume);
		};
		this.speedSliderChanged = function () {
			var sliderValue = this.obj_SpeedSlider.noUiSlider.get();
			//console.log('speedSliderChanged: ' + sliderValue);
			var newSpeed = Math.max(.25, sliderValue);
			newSpeed = Math.min(1.5, newSpeed);
			//console.log('Setting Speed: ' + newSpeed);
			this.setPlayerSpeed(newSpeed);
			$('#speedIndicator').text(newSpeed + 'x');
			this.f_PlaybackRate = newSpeed;
		};
		this.zoomSliderChanged = function () {
			this.b_ZoomSliderActivated = true;
			var sliderValue = this.obj_ZoomSlider.noUiSlider.get();
			this.setPlayerZoom(sliderValue);
			this.b_ZoomSliderActivated = false;
		};
		this.syncZoomSliderPosition = function () {
			if (!this.b_ZoomSliderActivated) {
				//console.log('syncZoomSliderPosition called.');  
				arrayMatrix = this.obj_PanZoom.panzoom('getTransform');
				zoomFactor = arrayMatrix[0];
				if (zoomFactor < 1.01) {
					this.setZoomSliderPosition(1);
					this.obj_PanZoom.panzoom("setTransform", "matrix(1,0,0,1,0,0)");
				}
				else {
					this.setZoomSliderPosition(zoomFactor);
				}
			}
		};
		this.setVolumeSliderPosition = function (value) {
			//console.log('setVolumeSliderPosition called');
			this.obj_VolumeSlider.noUiSlider.set(this.f_Volume);
		};
		this.setZoomSliderPosition = function (value) {
			this.obj_ZoomSlider.noUiSlider.set(value);
		};
		this.setPlayerZoom = function (zoomFactor) {
			if (zoomFactor < 1.05) {
				this.obj_PanZoom.panzoom("setTransform", "matrix(1, 0, 0, 1, 0, 0)");
			}
			else {
				//console.log('Setting zoom to ' + zoomFactor);
				this.obj_PanZoom.panzoom("zoom", parseFloat(zoomFactor));
				$('#main-column').toggleClass('zoomed', true);
				let theArray = this.obj_PanZoom.panzoom("getTransform");
				//console.log("Current Transform After Zoom Is: " + theArray);
			}
		};
		this.createResolutionRadioButtons = function () {
			//console.log('createResolutionRadioButtons called.');
			var newSelectHTML = "";
			if (this.str_MediaType != 'audio') {
				for (let i = 0; i < this.a_VideoSources.length; i++) {
					newSelectHTML += "<div class='radio-button-wrapper'><input type='radio' name='selectedResolution' id='" + this.a_VideoSources[i]["resolution"] + "' value='" + this.a_VideoSources[i]["resolution"] + "' />";
					newSelectHTML += "<label for='" + this.a_VideoSources[i]["resolution"] + "' class='" + this.a_VideoSources[i]["hd"] + "'>" + this.a_VideoSources[i]["resolution"] + "</label></div>";
				}
				$('#resolutionSelect').html(newSelectHTML);
				$("input[name=selectedResolution]:radio").change(function () { thePlayer.theEngine.onUserChangedVideoResolution(); });
			}
			else {
				newSelectHTML += "<span class='nonbreaking'><input type='radio' checked disabled /> <label>Default</label></span>";
				$('#resolutionSelect').html(newSelectHTML);
			}
		};
        /*	this.createPlaybackRateButtons()
            {
                //console.log("createPlaybackRateButtons called.");
                var speedControlsHTML = "";
                for(let i = 0; i < this.a_PlaybackSpeeds.length; i++)
                {
                    speedControlsHTML += "<div class='radio-button-wrapper'><input type='radio' id='speed-" + i + "' name='selectedSpeed' value='" + this.a_PlaybackSpeeds[i]["factor"] + "' />";
                    speedControlsHTML += "<label for='speed-" + i + "'>" + this.a_PlaybackSpeeds[i]["label"] + "</label></div>";
        
                }
                $('#speedSelect').html(speedControlsHTML);
                $( "input[name=selectedSpeed]:radio" ).change(function(){thePlayer.theEngine.onUserChangedPlaybackRate()});
            }
        */
		this.playerSourceDataChanged = function () {
			//this.playerSeekTo( this.f_SavedTime );
			if (this.b_ResumePlaying) {
				this.playerPlay();
				this.b_ResumePlaying = false;
				this.playerSeekTo(this.f_SavedTime);
			}
			if (this.f_PlaybackRate != 1) {
				this.setPlayerSpeed(this.f_PlaybackRate);
			}
			this.b_BreakProgressUpdates = false;
		};
		this.onUserChangedVideoResolution = function () {
			let radioButtons = $("input[name=selectedResolution]:radio");
			let selectedSource = radioButtons.index(radioButtons.filter(':checked'));
			let sourceObject = this.a_VideoSources[selectedSource];
			let currentTime = this.f_CurrentTime;
			let currentSpeed = this.f_PlaybackRate;
			this.str_SavedResolution = sourceObject["resolution"];
			let bWasZoomed = this.b_ZoomEnabled;
			if (bWasZoomed) {
				this.toggleZoomEnabled();
			}
			if (this.str_MediaType == 'vimeo') {
				this.f_SavedTime = this.f_CurrentTime;
				this.b_BreakProgressUpdates = true;
				var srcURL = this.a_VideoSources[selectedSource]["url"];
				if (this.isPlaying()) {
					this.b_ResumePlaying = true;
					this.b_ProcessingUserPlaybackToggle = true;
				}
				this.playerSetActiveSource(selectedSource);
			}
			else if (this.str_MediaType == 'youtube') {
				var resolutionString = this.getYTQualityString(sourceObject["resolution"]);
				this.f_SavedTime = this.f_CurrentTime;
				//console.log('Attempting to set player resolution to ' + resolutionString)
				this.playerPause();
				//this.MediaPlayer.tech(this.obj_Safety).ytPlayer.setPlaybackQuality(resolutionString);
				this.playerPlay();
				;
				this.playerSeekTo(this.f_CurrentTime - 1);
			}
		};
        /*	this.onUserChangedPlaybackRate()
            {
                //console.log("Player Speed Changed.")
                var radioButtons = $( "input[name=selectedSpeed]:radio");
                var selectedSpeed = radioButtons.index(radioButtons.filter(':checked'));
                var speedObject = this.a_PlaybackSpeeds[selectedSpeed];
                var newSpeed = speedObject["factor"];
                //console.log("Setting new speed: " + newSpeed);
                this.setPlayerSpeed( newSpeed );
                this.f_PlaybackRate = newSpeed;
            }
            
        */
		this.updateSelectedResolution = function () {
			var selectedSourceIndex = 0;
			if (this.str_MediaType == 'vimeo') {
				var currentSource = this.MediaPlayer.src;
				for (let i = 0; i < this.a_VideoSources.length; i++) {
					if (this.a_VideoSources[i]["url"] == currentSource) {
						selectedSourceIndex = i;
						break;
					}
				}
			}
			else if (this.str_MediaType == 'youtube') {
                /*
                var ytQualityString = this.MediaPlayer.tech(this.obj_Safety).ytPlayer.getPlaybackQuality();
                var qualityString = this.convertYTString( ytQualityString );

                for(let i = 0; i < this.a_VideoSources.length; i++)
                {
                    if( this.a_VideoSources[i]["resolution"] == qualityString)
                    {
                        selectedSourceIndex = i;
                        break;
                    }
                }*/
			}
			var radioButtons = $("input[name=selectedResolution]:radio");
			$(radioButtons[selectedSourceIndex]).prop("checked", true);
		};
		this.updateSelectedSpeed = function () {
			this.f_PlaybackRate = this.media.getPlaybackRate();
			var selectedSpeedIndex = 0;
			for (let i = 0; i < this.a_PlaybackSpeeds.length; i++) {
				if (this.a_PlaybackSpeeds[i]["factor"] == this.f_PlaybackRate) {
					selectedSpeedIndex = i;
					break;
				}
			}
			var radioButtons = $("input[name=selectedSpeed]:radio");
			$(radioButtons[selectedSpeedIndex]).prop("checked", true);
		};
        /*****************************************
        *************  Cookie Stuff   ************
        *****************************************/
		this.restorePlayerCookieSettings = function () {
			//Restore the last played resolution.
			var savedResolution = localStorage.getItem('proPlayerResolution');
			if (savedResolution === null) {
				savedResolution = 360;
			}
			this.str_SavedResolution = savedResolution;
			if (this.str_SavedResolution < 0 || this.str_SavedResolution > 1080) {
				this.str_SavedResolution = 360;
			}
			//Restore the last volume setting.
			var savedVolume = localStorage.getItem('proPlayerVolume');
			//console.log('Restored volume: ' + savedVolume);
			if (savedVolume !== null) {
				if (savedVolume < 0 || savedVolume > 1) {
					savedVolume = .7;
				}
			}
			else {
				savedVolume = .7;
			}
			this.f_Volume = savedVolume;
			//Restore the player flipped state
			var savedFlip = localStorage.getItem('proPlayerFlipped');
			if (savedFlip !== null) {
				if (savedFlip == "true") {
					this.b_PlayerFlipped = true;
				}
				else {
					this.b_PlayerFlipped = false;
				}
			}
			var savedPlaybackPositions = JSON.parse(localStorage.getItem('proPlayerPlaybackLocations'));
			var bMatchFound = false;
			if (savedPlaybackPositions !== null) {
				//Playback Positions were found in local storage,
				// now search for a match and load the saved time.
				for (let i = 0; i < savedPlaybackPositions.length; i++) {
					if (savedPlaybackPositions[i]['mediaCode'] == this.str_MediaCode) {
						this.f_SavedTime = savedPlaybackPositions[i]['time'];
						bMatchFound = true;
					}
				}
				if (this.f_SavedTime < 0) {
					this.f_SavedTime = 0;
				}
				else {
					//console.log("Found saved time for this item");
					this.f_CurrentTime = this.f_SavedTime;
					//console.log("Setting current time to: " + this.f_CurrentTime);
				}
			}
		};
		this.saveCookieValues = function () {
			//console.log("Saving Volume: " + this.f_Volume);
			localStorage.setItem('proPlayerVolume', this.f_Volume);
			localStorage.setItem('proPlayerResolution', this.str_SavedResolution);
			localStorage.setItem('proPlayerFlipped', this.b_PlayerFlipped);
			if (this.f_CurrentTime < this.f_VideoDuration - 10 && this.f_CurrentTime > 10) {
				//console.log("Starting save playback location");
				var savedPlaybackPositions = JSON.parse(localStorage.getItem('proPlayerPlaybackLocations'));
				if (savedPlaybackPositions == null) {
					savedPlaybackPositions = [];
				}
				var bMatchFound = false;
				var nMatchIndex = 0;
				for (let i = 0; i < savedPlaybackPositions.length; i++) {
					if (savedPlaybackPositions[i].mediaCode == this.str_MediaCode) {
						bMatchFound = true;
						nMatchIndex = i;
						break;
					}
				}
				if (bMatchFound) {
					savedPlaybackPositions[nMatchIndex].time = this.f_CurrentTime;
				}
				else {
					// attempting to set value of this item in playback positions;
					var newPlaybackPosition = {};
					newPlaybackPosition.mediaType = this.str_MediaType;
					newPlaybackPosition.mediaCode = this.str_MediaCode;
					newPlaybackPosition.time = this.f_CurrentTime;
					savedPlaybackPositions.unshift(newPlaybackPosition);
				}
				//console.log("Saving playback location");
				localStorage.setItem('proPlayerPlaybackLocations', JSON.stringify(savedPlaybackPositions));
			}
		};
        /*****************************************
        *************   Player Flipping  ************
        *****************************************/
		this.togglePlayerFlipped = function () {
			this.b_PlayerFlipped = !this.b_PlayerFlipped;
			this.setPlayerFlipped(this.b_PlayerFlipped);
		};
		this.setPlayerFlipped = function (isFlipped) {
			if (isFlipped) {
				if (this.str_MediaType == "vimeo") {
					$('.mejs__mediaelement video').toggleClass('flipped', true);
				}
				else if (this.str_MediaType == "youtube" || this.str_MediaType == "facebook") {
					$('.mejs__mediaelement iframe').toggleClass('flipped', true);
				}
				$('.mejs__poster').toggleClass('flipped', true);
				$('input#flipPlayer').attr('Checked', 'Checked');
			}
			else {
				if (this.str_MediaType == "vimeo") {
					$('.mejs__mediaelement video').toggleClass('flipped', false);
				}
				else if (this.str_MediaType == "youtube" || this.str_MediaType == "facebook") {
					$('.mejs__mediaelement iframe').toggleClass('flipped', false);
				}
				$('.mejs__poster').toggleClass('flipped', false);
				$('input#flipPlayer').removeAttr('Checked');
			}
		};
		this.convertYTString = function (ytString) {
			var resolutionString = "";
			switch (ytString) {
				case "hd1080":
					resolutionString = "1080";
					break;
				case "hd720":
					resolutionString = "720";
					break;
				case "large":
					resolutionString = "480";
					break;
				case "medium":
					resolutionString = "360";
					break;
				case "small":
					resolutionString = "240";
					break;
				case "tiny":
					resolutionString = "144";
					break;
				case "auto":
					resolutionString = "Auto";
					break;
			}
			return resolutionString;
		};
		this.getYTQualityString = function (qualityString) {
			var resolutionString = "";
			switch (qualityString) {
				case "1080":
					resolutionString = "hd1080";
					break;
				case "720":
					resolutionString = "hd720";
					break;
				case "480":
					resolutionString = "large";
					break;
				case "360":
					resolutionString = "medium";
					break;
				case "240":
					resolutionString = "small";
					break;
				case "144":
					resolutionString = "tiny";
					break;
				case "Auto":
					resolutionString = "auto";
					break;
			}
			return resolutionString;
		};
		this.toggleVideoControls = function () {
			//console.log('Toggling video controls');
			$("#videoControlsMenu").toggle();
			$("#controls-toggle").toggleClass('set');
		};
		this.secondsToMinutes = function (time) {
			var minutes = Math.floor(time / 60);
			var seconds = (time - minutes * 60).toFixed(0).toString();
			if (seconds.length == 1) {
				seconds = "0" + seconds;
			}
			return minutes.toString() + ":" + seconds;
		};
	}
}

