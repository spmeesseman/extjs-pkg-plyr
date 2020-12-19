/**
 * @class Ext.ux.Plyr
 *
 * ExtJS Plyr Wrapper
 * 
 * This ExtJs component uses the Plyr control by Sam Potts - https://github.com/sampotts/plyr.
 * 
 * Wraps the Plyr JavaScript control and manages multiple plyr instances in a component for an
 * ExtJs single page application.
 * 
 * Example Usage:
 * 
 *  	items: [
 *      {
 * 			xtype: 'plyr',
 *  		url: 'https://some.url.com/to/mediafile.extension,
 *          currentTime: 0,
 *          videoCtlListTags: '',
 *          plyrShowSpeed: false,
 *          plyrLog: myLogFunction,
 *          plyrLogValue: myLogValueFunction,
 *          plyrType: 'audio',
 *          onPlaying: myOnPlayFunction,
 *          onPaused: myOnPauseFunction,
 *          onEnded: myOnEndFunction,
 *          onReady: function() {
 *              ...
 *          }
 *      }]
 * 
 * @singleton
 * 
 * List of available plyr API methods:
 *
 *     play()¹	           -	Start playback.
 *     pause()	           -	Pause playback.
 *     stop()	           -	Stop playback and reset to start.
 *     restart()	       -	Restart playback.
 *     fullscreen.enter()	-	Enter fullscreen. If fullscreen is not supported, a fallback "full window/viewport" is used instead.
 *     fullscreen.exit()	-	Exit fullscreen.
 *     fullscreen.toggle()	-	Toggle fullscreen.
 *     airplay()	        -	Trigger the airplay dialog on supported devices.
 *     destroy()	        -	Destroy the instance and garbage collect any elements.
 *     togglePlay(toggle)	    Boolean	Toggle playback, if no parameters are passed, it will toggle based on current status.
 *     rewind(seekTime)	        Number  Rewind playback by the specified seek time. If no parameter is passed, the default seek time will be used.
 *     forward(seekTime)	    Number	Fast forward by the specified seek time. If no parameter is passed, the default seek time will be used.
 *     increaseVolume(step)	    Number	Increase volume by the specified step. If no parameter is passed, the default step will be used.
 *     decreaseVolume(step)	    Number	Increase volume by the specified step. If no parameter is passed, the default step will be used.
 *     toggleCaptions(toggle)   Boolean	Toggle captions display. If no parameter is passed, it will toggle based on current status.
 *     toggleControls(toggle)   Boolean	Toggle the controls (video only). Takes optional truthy value to force it on/off.
 *     on(event, function)	    String, Function	Add an event listener for the specified event.
 *     once(event, function)    String, Function	Add an event listener for the specified event once.
 *     off(event, function)	    String, Function	Remove an event listener for the specified event.
 *     supports(type)	        String	Check support for a mime type.
 *
 * List of available Getters and Setters
 *
 *     Prop     Get Set Description
 *
 *     isHTML5	✓	-	Returns a boolean indicating if the current player is HTML5.
 *     isEmbed	✓	-	Returns a boolean indicating if the current player is an embedded player.
 *     playing	✓	-	Returns a boolean indicating if the current player is playing.
 *     paused	✓	-	Returns a boolean indicating if the current player is paused.
 *     stopped	✓	-	Returns a boolean indicating if the current player is stopped.
 *     ended	✓	-	Returns a boolean indicating if the current player has finished playback.
 *     buffered	✓	-	Returns a float between 0 and 1 indicating how much of the media is buffered
 *     currentTime	✓	✓	Gets or sets the currentTime for the player. The setter accepts a float in seconds.
 *     seeking	✓	-	Returns a boolean indicating if the current player is seeking.
 *     duration	✓	-	Returns the duration for the current media.
 *     volume	✓	✓	Gets or sets the volume for the player. The setter accepts a float between 0 and 1.
 *     muted	✓	✓	Gets or sets the muted state of the player. The setter accepts a boolean.
 *     hasAudio	✓	-	Returns a boolean indicating if the current media has an audio track.
 *     speed	✓	✓	Gets or sets the speed for the player. The setter accepts a value in the options 
 *                       specified in your config. Generally the minimum should be 0.5.
 *     quality¹	✓	✓	Gets or sets the quality for the player. The setter accepts a value from the options
 *                       specified in your config.
 *     loop	    ✓	✓	Gets or sets the current loop state of the player. The setter accepts a boolean.
 *     source	✓	✓	Gets or sets the current source for the player. The setter accepts an object. See source
 *                       setter below for examples.
 *     poster	✓	✓	Gets or sets the current poster image for the player. The setter accepts a string; the URL
 *                       for the updated poster image.
 *     autoplay	✓	✓	Gets or sets the autoplay state of the player. The setter accepts a boolean.
 *     currentTrack	✓	✓	Gets or sets the caption track by index. -1 means the track is missing or captions is not active
 *     language	✓	✓	Gets or sets the preferred captions language for the player. The setter accepts an
 *                       ISO two-letter language code. Support for the languages is dependent on the captions you include.
 *                       If your captions don't have any language data, or if you have multiple 
 *                       tracks with the same language, you may want to use currentTrack instead.
 *     pip	    ✓	✓	Gets or sets the picture-in-picture state of the player. The setter accepts a boolean. This
 *                       currently only supported on Safari 10+ (on MacOS Sierra+ and iOS 10+) and Chrome 70+.
 *     ratio	✓	✓	Gets or sets the video aspect ratio. The setter accepts a string in the same format as the ratio option.
 *     download	✓	✓	Gets or sets the URL for the download button. The setter accepts a string containing a valid absolute URL.
 *     fullscreen.active    ✓	-	Returns a boolean indicating if the current player is in fullscreen mode.
 *     fullscreen.enabled	✓	-	Returns a boolean indicating if the current player has fullscreen enabled.
 * 
 *     var opts = {
 *    	enabled: true,           // Whether to completely disable Plyr
 *    	debug: false,            // Display debugging information in the console
 *    	autoplay: false,         // Autoplay the media on load. This is generally advised against
 *    	autopause: true,         // Only allow one player playing at once
 *    	muted: false,            // Whether to start playback muted
 *    	hideControls: true,      // Hide video controls automatically after 2s of no mouse
 *    	clickToPlay: true,       // Click (or tap) of the video container will toggle play/pause
 *    	disableContextMenu: true,// Disable right click menu on video
 *    	resetOnEnd: false,       // Reset the playback to the start once playback is complete
 *    	seekTime: 10,            // The time, in seconds, to seek when a user hits fast forward or rewind
 *    	volume: 1,               // A number, between 0 and 1, representing the initial volume of the player
 *    	duration: null,          // Specify a custom duration for media.
 *    	invertTime: true,        // Display the current time as a countdown rather than an incremental counter
 *    	// Displays the duration of the media on the "metadataloaded" event (on startup) in the current time display. 
 *    	//This will only work if the preload attribute is not set to none (or is not set at all) and you choose not to 
 *    	// display the duration (see controls option).
 *    	displayDuration: true,   
 *    	//
 *    	// If a function is passed, it is assumed your method will return either an element or HTML string 
 *    	// for the controls. Three arguments will be passed to your function; id (the unique id for the 
 *    	// player), seektime (the seektime step in seconds), and title (the media title). See controls.md 
 *    	//for more info on how the html needs to be structured.
 *    	// See https://github.com/spmeesseman/plyr/blob/master/controls.md for complete list of controls
 *    	//
 *    	controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
 *    	// If using the default controls are used then you can specify which settings to show in the menu
 *    	settings: ['captions', 'quality', 'speed', 'loop'],
 *    	keyboard: { focused: true, global: false }, // Enable keyboard shortcuts for focused players only or globally
 *    	tooltips: { controls: false, seek: true },  // Display control labels as tooltips on :hover & :focus (by default, the labels 
 *                are screen reader only). seek: Display a seek tooltip to indicate on click where the media would seek to.
 *    	storage:  { enabled: true, key: 'plyr' },   // enabled: Allow use of local storage to store user settings. key: The key name to use.
 *    	captions: { active: false, language: 'auto', update: false },
 *    	speed:    { selected: 1, options: [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2] }
 *    };
 *
 *    controls = [
 *    play-large', // The large play button in the center
 *    restart', // Restart playback
 *    rewind', // Rewind by the seek time (default 10 seconds)
 *    play', // Play/pause playback
 *    fast-forward', // Fast forward by the seek time (default 10 seconds)
 *    progress', // The progress bar and scrubber for playback and buffering
 *    current-time', // The current time of playback
 *    duration', // The full duration of the media
 *    mute', // Toggle mute
 *    volume', // Volume control
 *    captions', // Toggle captions
 *    settings', // Settings menu
 *    pip', // Picture-in-picture (currently Safari only)
 *    airplay', // Airplay (currently Safari only)
 *    download', // Show a download button with a link to either the current source or a custom URL you specify in your options
 *    fullscreen', // Toggle fullscreen
 *   
 *    Register events
 *   
 *    Available Standard Media Events
 *   
 *    Event Type       Description
 *    progress	        Sent periodically to inform interested parties of progress downloading the media.
 *                      Information about the current amount of the media that has been downloaded is available
 *                      in the media element's buffered attribute.
 *    playing	        Sent when the media begins to play (either for the first time, after having been paused,
 *                      or after ending and then restarting).
 *    play	            Sent when playback of the media starts after having been paused; that is, when playback
 *                      is resumed after a prior pause event.
 *    pause	            Sent when playback is paused.
 *    timeupdate	    The time indicated by the element's currentTime attribute has changed.
 *    volumechange	    Sent when the audio volume changes (both when the volume is set and when the muted state is changed).
 *    seeking	        Sent when a seek operation begins.
 *    seeked	        Sent when a seek operation completes.
 *    ratechange	    Sent when the playback speed changes.
 *    ended	            Sent when playback completes. Note: This does not fire if autoplay is true.
 *    enterfullscreen	Sent when the player enters fullscreen mode (either the proper fullscreen or full-window fallback for older browsers).
 *    exitfullscreen	Sent when the player exits fullscreen mode.
 *    captionsenabled	Sent when captions are enabled.
 *    captionsdisabled	Sent when captions are disabled.
 *    languagechange	Sent when the caption language is changed.
 *    controlshidden	Sent when the controls are hidden.
 *    controlsshown	    Sent when the controls are shown.
 *    ready	            Triggered when the instance is ready for API calls.
 *   
 *    Available HTML5 Only Events
 *   
 *    Event Type	    Description
 *    loadstart	        Sent when loading of the media begins.
 *    loadeddata	    The first frame of the media has finished loading.
 *    loadedmetadata	The media's metadata has finished loading; all attributes now contain as much useful information
 *                      as they're going to.
 *    qualitychange	    The quality of playback has changed.
 *    canplay	        Sent when enough data is available that the media can be played, at least for a couple
 *                      of frames. This corresponds to the HAVE_ENOUGH_DATA readyState.
 *    canplaythrough	Sent when the ready state changes to CAN_PLAY_THROUGH, indicating that the entire media can be
 *                      played without interruption, assuming the download rate remains at least at the current level.
 *                      Note: Manually setting the currentTime will eventually fire a canplaythrough event in firefox.
 *                      Other browsers might not fire this event.
 *    stalled	        Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
 *    waiting	        Sent when the requested operation (such as playback) is delayed pending the completion of another
 *                      operation (such as a seek).
 *    emptied   	    The media has become empty; for example, this event is sent if the media has already been loaded
 *                      (or partially loaded), and the load() method is called to reload it.
 *    cuechange	        Sent when a TextTrack has changed the currently displaying cues.
 *    error	            Sent when an error occurs. The element's error attribute contains more information.
 */
Ext.define('Ext.ux.Plyr', 
{
    extend: 'Ext.Container',
	xtype: 'plyr',
	
    reference: 'player',
	layout: 'fit',
    style: 
    {
    	padding: '0 0 0 0',
    	border: '0'
    },

	/**
	 * @deprecated 1.4.3 Use {@link Ext.ux.Plyr#onCanPlay}
	 */
	plyrInitialProgress: false,
    /**
	 * @deprecated 1.4.3 Use {@link Ext.ux.Plyr#onLoadFinished}
	 */
	plyrOnLoaded: Ext.emptyFn,
	/**
	 * @deprecated 1.4.3 Use {@link Ext.ux.Plyr#onProgress}
	 */
	plyrOnProgress: Ext.emptyFn,
	/**
	 * @deprecated 1.4.3 Use {@link Ext.ux.Plyr#onReady}
	 */
	plyrInitialized: false,

	/**
	 * @property {Object} player
	 */
	player: null,
	/**
	 * @property {String} playerId
	 */
	playerId: null,
	/**
	 * @property {Boolean} plyrHTML5
	 */
	plyrHTML5: true,
	/**
	 * @property {Boolean} intializationInProgress
	 */
	intializationInProgress: 0,

	privates:
    {
		taskRunner: null,
		taskRunnerTask: null,
		idRoot: 0,
        logTag: '[Plyr]',
		logTagColor: '#3fbf63',
		loading: 0
	},
	
    statics:
    {
    	playerIdCounter: 0
    },

    config:
    {
		/**
		 * @cfg {String} audioCtlListTags
		 */
		audioCtlListTags: '',
		/**
		 * @cfg {Boolean} autoPlay
		 */
		autoPlay: false,
		/**
		 * @cfg {Object|Function} captureActivity
		 */
		captureActivity: {
    		fn: Ext.emptyFn,
    		scope: null
    	},
        /**
		 * @cfg {Number} currentTime
		 */
		currentTime: 0,
		/**
		 * @cfg {Function} onCanPlay
		 * @since 1.4.3
		 */
		onCanPlay: null,
		/**
		 * @cfg {Function} onCanPlayThrough
		 * @since 1.4.3
		 */
		onCanPlayThrough: null,
		/**
		 * @cfg {Function} onEnded Currently loaded audio file playback has ended
		 * @since 1.8.0
		 */
		onEnded: null,
		/**
		 * @cfg {Function} onError
		 * @since 1.8.0
		 */
		onError: null,
		/**
		 * @cfg {Function} onLoadStart
		 * @since 1.4.3
		 */
		onLoadStart: null,
		/**
		 * @cfg {Function} onLoadFinished
		 * @since 1.4.3
		 */
		onLoadFinished: null,
		/**
		 * @cfg {Function} onPaused
		 * @since 1.8.0
		 */
		onPaused: null,
		/**
		 * @cfg {Function} onPlaying
		 * @since 1.8.0
		 */
		onPlaying: null,
		/**
		 * @cfg {Function} onProgress
		 * @since 1.4.3
		 */
		onProgress: null,
		/**
		 * @cfg {Function} onReady
		 * @since 1.4.3
		 */
		onReady: null,
		/**
		 * @cfg {Function} onSeekEnded
		 * @since 1.11.0
		 */
		onSeekEnded: null,
		/**
		 * @cfg {Function} onSeekStart
		 * @since 1.11.0
		 */
		onSeekStarted: null,
		/**
		 * @cfg {Function} onStalled
		 * @since 1.4.3
		 */
		onStalled: null,
		/**
		 * @cfg {Function} onWaiting
		 * @since 1.4.3
		 */
		onWaiting: null,
		/**
		 * @cfg {Function} plyrLog
		 */
		plyrLog: null,
		/**
		 * @cfg {Function} plyrLogValue
		 */
		plyrLogValue: null,
		/**
		 * @cfg {String} plyrType
		 */
		plyrType: 'audio',  // or 'video', 'or 'youtube'
        /**
		 * @cfg {Boolean|Number[]} speed
		 */
		plyrShowSpeed: true,
        /**
		 * @cfg {String} url
		 */
		url: ''
    },

    publishes:
    {
        url: true,
        audioCtlListTags: true,
		currentTime: true,
		plyrType: true
    },
	
	listeners:
	{
		beforedestroy: function(cmp, eopts)
		{
			var me = this;
			if (me.player && me.player.destroy) {
				me.logCustom('Releasing player resources', 1);
				me.player.off('ready', me.onReadyInternal);
				me.player.off('progress', me.onProgressInternal);
				me.player.off('error', me.onErrorInternal);
				me.player.off('canplay', me.onCanPlayInternal);
				me.player.off('canplaythrough', me.onCanPlayThroughInternal);
				me.player.off('loadstart', me.onLoadStartInternal);
				me.player.off('loadeddata', me.onLoadFinishedInternal);
				me.player.off('stalled', me.onStalledInternal);
				me.player.off('waiting', me.onWaitingInternal);
				if (Ext.isFunction(me.getOnPlaying())) {
					me.player.off('playing', me.getOnPlaying());
				}
				if (Ext.isFunction(me.getOnPaused())) {
					me.player.off('pause', me.getOnPaused());
				}
				if (Ext.isFunction(me.getOnError())) {
					me.player.off('error', me.getOnError());
				}
				if (Ext.isFunction(me.getOnEnded())) {
					me.player.off('ended', me.getOnEnded());
				}
				if (Ext.isFunction(me.getOnSeekEnded())) {
					me.player.off('seeked', me.getOnSeekEnded());
				}
				if (Ext.isFunction(me.getOnSeekStarted())) {
					me.player.off('seeking', me.getOnSeekStarted());
				}
				me.player.destroy();
			}
		}
	},


    getIdRoot: function()
    {
		var me = this;
		if (!me.idRoot) {
			me.idRoot = ++Ext.ux.Plyr.playerIdCounter;
			me.playerId = 'player_' + me.idRoot.toString();
		}
        return me.idRoot;
	},
	

	isLoading: function()
	{
		return this.loading;
	},


	updateCurrentTime: function(v)
	{
		var me = this;
		
		me.logCustom('CurrentTime change - ' + (v ? v : 'null'), 1);

		if (!me.player) {
			me.logCustom('No active player', 1);
			return v;
		}

		if (!(v instanceof Number)) {
			return v;
		}

		me.logCustom('   Update current time', 1);
		me.logCustom('      Current time: \'' + v + '\' seconds', 1);

		me.player.currentTime = v;

		return v;
	},


	updateUrl: function(v)
	{
		var me = this;
		
		me.logCustom('Source change - ' + (v ? v : 'null'), 1);

		if (!me.player) {
			me.logCustom('No active player', 1);
			return v;
		}

		me.logCustom('   Update source url', 1);
		me.logCustom('      URL: ' + v ? v : '', 1);

		me.setSource(v);

		return v;
	},


	updateAutoPlay: function(v)
	{
		var me = this;
		
		me.logCustom('AutoPlay change - ' + (v ? v : 'null'), 1);

		if (!me.player) {
			me.logCustom('No active player', 1);
			return v;
		}

		me.player.autoplay = !!v;

		return v;
	},

	ffwd: function(seconds)
	{
		var me = this;
		
		me.logCustom('Command received - Fast Forward', 1);

		if (!me.player) {
			me.logCustom('No active player', 1);
			return;
		}

		if (!seconds) {
			seconds = 2;
		}

		me.stopTaskRunner();

		if (me.plyrHTML5 !== false) {
			me.player.forward(seconds);
		}
		else {
			me.player.controls.forward(seconds);
		}
	},


	ffwdStart: function(seconds, stepms)
	{
		var me = this;

		me.logCustom('Command received - Fast Forward Start', 1);
		if (!me.player) {
			me.logCustom('No active player', 1);
			return;
		}

		if (!seconds) {
			seconds = 2;
		}

		me.stopTaskRunner();

		me.player.forward(seconds);

		//
		// TODO - this should actually use a webworker in the case the browser window
		// loses focus or is not the active window
		//
		if (!me.taskRunner) {
			me.taskRunner = new Ext.util.TaskRunner();	
		}

		me.taskRunnerTask = me.taskRunner.start({
			run: function()
			{
				if (me.plyrHTML5 !== false) {
					me.player.forward(seconds);
				}
				else {
					me.player.controls.forward(seconds);
				}
			},
			interval: stepms ? stepms : 500
		});
	},


	ffwdRwdStop: function()
	{
		var me = this;

		me.logCustom('Command received - Fast Forward / Rewind Stop', 1);

		if (!me.player) {
			me.logCustom('No active player', 1);
			return;
		}

		me.stopTaskRunner();
	},


	pause: function()
	{
		var me = this;
		
		me.logCustom('Command received - Pause', 1);
		if (!me.player) {
			me.logCustom('No active player', 1);
			return;
		}

		me.stopTaskRunner();

		if (me.plyrHTML5 !== false) {
			me.player.pause();
		}
		else {
			me.player.controls.pause();
		}
	},


	play: function()
	{
		var me = this;
		
		me.logCustom('Command received - Play', 1);
		if (!me.player) {
			me.logCustom('No active player', 1);
			return;
		}

		me.stopTaskRunner();

		if (me.plyrHTML5 !== false) {
			me.player.play();
		}
		else {
			me.player.controls.play();
		}
	},


	togglePlay: function()
	{
		var me = this;
		
		me.logCustom('Command received - Toggle Play/Pause', 1);
		if (!me.player) {
			me.logCustom('No active player', 1);
			return;
		}

		me.stopTaskRunner();

		if (me.plyrHTML5 !== false) {
			me.player.togglePlay();
		}
		else {
			me.player.controls.togglePlay();
		}
	},


	rwd: function(seconds)
	{
		var me = this;
		
		me.logCustom('Command received - Rewind', 1);
		if (!me.player) {
			me.logCustom('No active player', 1);
			return;
		}

		if (!seconds) {
			seconds = 2;
		}

		me.stopTaskRunner();

		if (me.plyrHTML5 !== false) {
			me.player.rewind(seconds);
		}
		else {
			me.player.controls.rewind(seconds);
		}
	},


	rwdStart: function(seconds, stepms)
	{
		var me = this;

		me.logCustom('Command received - Rewind Start', 1);
		if (!me.player) {
			me.logCustom('No active player', 1);
			return;
		}

		if (!seconds) {
			seconds = 2;
		}

		me.stopTaskRunner();

		if (me.plyrHTML5 !== false) {
			me.player.rewind(seconds);
		}
		else {
			me.player.controls.rewind(seconds);
		}

		///
		// TODO - this should actually use a webworker in the case the browser window
		// loses focus or is not the active window
		//
		if (!me.taskRunner) {
			me.taskRunner = new Ext.util.TaskRunner();	
		}

		me.taskRunnerTask = me.taskRunner.start({
			run: function()
			{
				me.player.rewind(seconds);
			},
			interval: stepms ? stepms : 500
		});
	},


	stop: function()
	{
		var me = this;
		
		me.logCustom('Command received - Stop', 1);
		if (!me.player) {
			me.logCustom('No active player', 1);
			return;
		}

		me.stopTaskRunner();

		if (me.plyrHTML5 !== false) {
			me.player.stop();
		}
		else {
			me.player.controls.stop();
		}
	},


	stopTaskRunner: function()
	{
		var me = this;
		if (me.taskRunner && me.taskRunnerTask)
		{
			me.taskRunner.stop(me.taskRunnerTask, true);
			me.taskRunnerTask = null;
		}
	},

	
	initComponent: function() 
    {
		var me = this, src,
			pType = me.getPlyrType();

		me.plyrHTML5 = !Ext.isIE;
		if (!pType) {
			pType = 'audio';
			me.setPlyrType(pType);
		}

		if (pType === 'audio' || pType === 'video')
		{
			me.html = me.plyrHTML5 ? ///'<' + me.getPlyrType() + ' id="player_' + me.getIdRoot() + '" ' +
							//'controls controlsList="' + me.getAudioCtlListTags() + '" autoplay="' + (me.getAutoPlay() ? 'true' : 'false') +
							//'" style="width:100%"> This browser does not support HTML 5.' +
						'<' + me.getPlyrType() + ' id="player_' + me.getIdRoot() + '" ' +
							'controls controlsList="' + me.getAudioCtlListTags() + '" style="width:100%"> ' +
							'This browser does not support HTML 5.' +
						'</' + me.getPlyrType() + '>' : 
						//
						// IE does not support HTML5 Audio Player
						//
						'<object id="player_' + me.getIdRoot() + '" classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6" ' +
							'type="application/x-oleobject" width="100%" height="50">' +
							'<param name="autostart" value="' + (me.getAutoPlay() ? 'true' : 'false') + '">' +
							'<param name="balance" value="0">' +
							'<param name="enabled" value="true">' +
							'<param name="url" value="' + me.getUrl() + '">' +
							'<param name="volume" value="100">' +
							'<param name="showstatusbar" value="true">' +
							'<param name="currentposition" value="' + me.getCurrentTime() + '">' +
						'</object>';
		}
		else if (pType === 'vimeo')
		{
			src = 'https://player.vimeo.com/video/' + me.getUrl() + '?loop=false&amp;byline=false&amp;portrait=false&amp;' +
			      'title=false&amp;speed=true&amp;transparent=0&amp;gesture=media';
			me.html = '<div class="plyr__video-embed" id="player_' + me.getIdRoot() + '">' +
						'<iframe src="' + src + '" allowfullscreen allowtransparency allow="autoplay"></iframe>' +
					  '</div>';
		}
		else if (pType === 'youtube')
		{
			src = 'https://www.youtube.com/embed/' + me.getUrl() + '?origin=' + location.origin + '&amp;iv_load_policy=3&amp;' +
			      'modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1';
			me.html = '<div class="plyr__video-embed" id="player_' + me.getIdRoot() + '">' +
						'<iframe src="' + src + '" allowfullscreen allowtransparency allow="autoplay"></iframe>' +
					  '</div>';
		}

		me.callParent(arguments);
	},


	afterRender: function() 
    {
    	var me = this;
    	me.callParent(arguments);
		me.plyrInitialized = false;

		Ext.create('Ext.util.DelayedTask', function()
		{
			me.initPlyr();
		}, me).delay(10);
	},
	

	initPlyr: function()
	{
		var me = this;

		me.logCustom('', 1);

		if (!me.plyrHTML5)
		{
			me.logCustom('Loading Plyr Fallback Media Player', 1);
			me.logCustom('   Is IE: ' + Ext.isIE.toString(), 1);
			me.player = document[me.playerId];
			if (me.player && me.getUrl())
			{
				me.player.URL = me.getUrl();
			}
			return;
		}

		me.logCustom('Loading Plyr', 1);
		
		var opts2 = {
			// count up instead of down
			invertTime: false,
			// show duration
			controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 
					   'pip', 'airplay', 'fullscreen', 'duration', 'restart', 'rewind', 'fast-forward' ]
		};

		if (me.getPlyrShowSpeed() === false) {
			opts2.settings = ['captions', 'quality'];
		}

		if (me.getAutoPlay()) {
			opts2.autoplay = true;
		}
		
		me.player = new Plyr('#' + me.playerId, opts2);

		if (me.getUrl())
		{
			me.logValueCustom('   Set url', me.getUrl(), 1);
			me.setSource();
		}

		me.player.on('ready', function(e)    { me.onReadyInternal(e); });
		me.player.on('progress', function(e) { me.onProgressInternal(e); });
		me.player.on('error', function(e)    { me.onErrorInternal(e); });
		me.player.on('canplay', function(e)  { me.onCanPlayInternal(e); });
		me.player.on('canplaythrough', function(e) { me.onCanPlayThroughInternal(e); });
		me.player.on('loadstart', function(e)  { me.onLoadStartInternal(e); });
		me.player.on('loadeddata', function(e) { me.onLoadFinishedInternal(e); });
		me.player.on('stalled', function(e)    { me.onStalledInternal(e); });
		me.player.on('waiting', function(e)    { me.onWaitingInternal(e); });
		if (Ext.isFunction(me.getOnPlaying())) {
			me.player.on('playing', me.getOnPlaying());
		}
		if (Ext.isFunction(me.getOnPaused())) {
			me.player.on('pause', me.getOnPaused());
		}
		if (Ext.isFunction(me.getOnError())) {
			me.player.on('error', me.getOnError());
		}
		if (Ext.isFunction(me.getOnEnded())) {
			me.player.on('ended', me.getOnEnded()); // does not fire if autoplay is true
		}
		if (Ext.isFunction(me.getOnSeekStarted())) {
			me.player.on('seeking', me.getOnSeekStarted());
		}
		if (Ext.isFunction(me.getOnSeekEnded())) {
			me.player.on('seeked', me.getOnSeekEnded());
		}
/*
		me.player.on('statechange', me.onStateChangedYouTubeInternal);
*/
	},


	logCustom: function(msg, lvl)
	{
		var me = this;
		if (me.plyrLog) {
			me.plyrLog(msg, lvl, false, false, null, me.logTag, me.logTagColor);
		}
		else {
            console.log('%c' + me.logTag, 'color: ' + me.logTagColor, '', msg);
        }
	},


	logValueCustom: function(msg, value, lvl)
	{
		var me = this;
		if (me.plyrLogValue) {
			me.plyrLogValue(msg, value, lvl, false, false, me.logTag, me.logTagColor);
		}
		else {
            console.log('%c' + me.logTag, 'color: ' + me.logTagColor, '', msg, value);
        }
	},


	onCanPlayInternal: function(e) 
	{
		var me = this;
		me.logCustom('Event - Media player can play', 1);
		me.logValueCustom('   ID', me.playerId, 2);
		if (!me.loading && Ext.isFunction(me.onCanPlayThrough)) {
			Ext.create('Ext.util.DelayedTask', function() {
				this.onCanPlay();
			}, me).delay(100);
		}
	},


	onCanPlayThroughInternal: function(e) 
	{
		var me = this;
		me.logCustom('Event - Media player can play through', 1);
		me.logValueCustom('   ID', me.playerId, 2);
		if (!me.loading && Ext.isFunction(me.onCanPlayThrough)) {
			Ext.create('Ext.util.DelayedTask', function() {
				this.onCanPlayThrough();
			}, me).delay(100);
		}
	},


	onErrorInternal: function(e) 
	{
		var me = this;
		//const player = e.detail.plyr;
		me.logCustom('Event - Media player error', 1);
		me.logValueCustom('   ID', me.playerId, 2);
		if (Ext.isFunction(me.onError)) {
			me.onError();
		}
	},


	onLoadFinishedInternal: function(e) 
	{
		var me = this;
		me.logCustom('Event - First frame of media has loaded', 1);
		me.logValueCustom('   ID', me.playerId, 2);
		me.logValueCustom('   Was loading', me.loading, 2);
		me.loading--;
		if (me.loading === 0) {
			Ext.create('Ext.util.DelayedTask', function()
			{
				if (this.player.currentTime == 0 && this.getCurrentTime()) {
					this.player.currentTime = this.getCurrentTime();
				}
				if (Ext.isFunction(me.onLoadFinished)) {
					this.onLoadFinished();
				}
			}, me).delay(100);
		}
	},


	onLoadStartInternal: function(e) 
	{
		var me = this;
		me.logCustom('Event - Media started loading', 1);
		me.logValueCustom('   ID', me.playerId, 2);
		me.logValueCustom('   Was loading', me.loading, 2);
		me.loading++;
		if (me.loading === 1 && Ext.isFunction(me.onLoadStart)) {
			Ext.create('Ext.util.DelayedTask', function() {
				this.onLoadStart();
			}, me).delay(100);
		}
	},


	onProgressInternal: function(e) 
	{
		var me = this;

		me.logCustom('Event - Player progress', 1);
		me.logValueCustom('   ID', me.playerId, 1);

		me.plyrInitialProgress = true;

		if (Ext.isFunction(me.onProgress)) {
			me.onProgress();
		}

		//
		// Deprecated...
		//
		if (me.plyrOnProgress) 
		{
			if (me.plyrOnProgress instanceof Function) {
				me.plyrOnProgress(me.playerId, me.player);
			}
			else if (me.plyrOnProgress instanceof Object)
			{
				if (me.plyrOnProgress.fn) {
					if (me.plyrOnProgress.scope) {
						Ext.Function.pass(me.plyrOnProgress.fn, [ me.playerId, me.player ], me.plyrOnProgress.scope)();
					}
					else {
						me.plyrOnProgress.fn(me.playerId, me.player);
					}
				}
			}
		}
	},


	onReadyInternal: function(e) 
	{
		var me = this;

		me.logCustom('Event -Player initialized', 1);
		me.logValueCustom('   ID: ', me.playerId, 1);

		me.plyrInitialized = true;

		if (Ext.isFunction(me.onReady)) {
			me.onReady();
		}

		//
		// Deprecated...
		//
		if (me.plyrOnLoaded) {
			if (me.plyrOnLoaded instanceof Function) {
				me.plyrOnLoaded(me.playerId, me.player);
			}
			else if (me.plyrOnLoaded instanceof Object)
			{
				if (me.plyrOnLoaded.fn) {
					if (me.plyrOnLoaded.scope) {
						Ext.Function.pass(me.plyrOnLoaded.fn, [ me.playerId, me.player ], me.plyrOnLoaded.scope)();
					}
					else {
						me.plyrOnLoaded.fn(me.playerId, me.player);
					}
				}
			}
		}
	},


	onStalledInternal: function(e) 
	{
		var me = this;
		me.logCustom('Event - Media started loading', 1);
		me.logValueCustom('   ID', me.playerId, 2);
		if (Ext.isFunction(me.onStalled)) {
			me.onStalled();
		}
	},


	onStateChangedYouTubeInternal: function(e) 
	{
		var me = this;
		me.logCustom('   Media started loading', 1);
		me.logCustom('      ID: ' + me.playerId, 1);
		me.logCustom('      Code: ' + event.detail.code, 1);
		// -1: Unstarted, 0: Ended, 1: Playing, 2: Paused, 3: Buffering, 5: Video cued
	},


	onWaitingInternal: function(e) 
	{
		var me = this;
		me.logCustom('Event - Media waiting', 1);
		me.logValueCustom('   ID', me.playerId, 2);
		if (Ext.isFunction(me.onWaiting)) {
			me.onWaiting();
		}
	},


	setSource: function(src)
	{
		var me = this;
		if (me.getPlyrType() === 'audio')
		{
			me.player.source = {
				type: me.getPlyrType(),
				sources: [{
					src: src || me.getUrl()//,
					//type: 'audio/mp3',
				}]
			};
		}
		if (me.getPlyrType() === 'video')
		{
			me.player.source = {
				type: me.getPlyrType(),
				sources: [{
					src: src || me.getUrl()//,
					//type: 'video/mp4',
				}]
			};
		}
		else  if (me.getPlyrType() === 'youtube')
		{
			me.player.source = {
				type: 'video',
				sources: [{
					src: src || me.getUrl(),
					provider: 'youtube',
				}]
			};
		}
		else  if (me.getPlyrType() === 'vimeo')
		{
			me.player.source = {
				type: 'video',
				sources: [{
					src: src || me.getUrl(),
					provider: 'vimeo',
				}]
			};
		}
	}

});
