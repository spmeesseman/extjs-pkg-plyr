Ext.define('Ext.ux.Plyr', 
{
    extend: 'Ext.Container',
	xtype: 'plyr',
	
    reference: 'player',
    autoHeight: true,
	border:false,
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
		plyrType: 'audio',  // or 'video'
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
				me.logCustom("Releasing player resources", 1);
				me.setUrl('');
				me.player.off('ready', me.onReadyInternal);
				me.player.off('progress', me.onProgressInternal);
				me.player.off('error', me.onErrorInternal);
				me.player.off('canplay', me.onCanPlayInternal);
				me.player.off('canplaythrough', me.onCanPlayThroughInternal);
				me.player.off('loadstart', me.onLoadStartInternal);
				me.player.off('loadeddata', me.onLoadFinishedInternal);
				me.player.off('stalled', me.onStalledInternal);
				me.player.off('waiting', me.onWaitingInternal);
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
		
		me.logCustom("CurrentTime change - " + (v ? v : 'null'), 1);

		if (!me.player) {
			me.logCustom("No active player", 1);
			return v;
		}

		if (!(v instanceof Number)) {
			return v;
		}

		me.logCustom("   Update current time", 1);
		me.logCustom("      Current time: \'" + v + '\' seconds', 1);

		me.player.currentTime = v;

		return v;
	},


	updateUrl: function(v)
	{
		var me = this;
		
		me.logCustom("Source change - " + (v ? v : 'null'), 1);

		if (!me.player) {
			me.logCustom("No active player", 1);
			return v;
		}

		me.logCustom("   Update source url", 1);
		me.logCustom("      URL: " + v ? v : '', 1);

		me.player.source = 
		{
			type: me.getPlyrType(),
			sources: [
			{
				src: v ? v : ''//,
				//type: 'audio/mp3',
			}]
		};

		return v;
	},


	//bind:
    //{
    //    html: !me.plyrHTML5 ? 
    //    //
    //    // Non-IE
    //    //
    //    '<{player.plyrType} id="player_{player.idRoot}" ' +
	//	    'controls controlsList="{player.audioCtlListTags}" style="width:100%"> ' +
	//	    'This browser does not support HTML 5.' +
	//	'</{player.plyrType}>' : 
    //    //
    //    // IE does not support HTML5 Audio Player
    //    //
    //    '<object id="player_{player.idRoot}" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" '+
    //        'codebase="http://www.apple.com/qtactivex/qtplugin.cab" width="100%" height="50">' +
    //        '<param name="src" value="{player.url}">' +
    //        '<param name="autoplay" value="false">' +
    //        '<embed type="audio/x-wav" src="{player.url}" autoplay="false" autostart="false" width="100%" height="50">' +
    //    '</object>'
	//},

	//
	// List of available plyr API methods:
	//
	//     play()¹	           -	Start playback.
    //     pause()	           -	Pause playback.
    //     stop()	           -	Stop playback and reset to start.
    //     restart()	       -	Restart playback.
    //     fullscreen.enter()	-	Enter fullscreen. If fullscreen is not supported, a fallback "full window/viewport" is used instead.
    //     fullscreen.exit()	-	Exit fullscreen.
    //     fullscreen.toggle()	-	Toggle fullscreen.
    //     airplay()	        -	Trigger the airplay dialog on supported devices.
    //     destroy()	        -	Destroy the instance and garbage collect any elements.
    //     togglePlay(toggle)	    Boolean	Toggle playback, if no parameters are passed, it will toggle based on current status.
    //     rewind(seekTime)	        Number  Rewind playback by the specified seek time. If no parameter is passed, the default seek time will be used.
    //     forward(seekTime)	    Number	Fast forward by the specified seek time. If no parameter is passed, the default seek time will be used.
    //     increaseVolume(step)	    Number	Increase volume by the specified step. If no parameter is passed, the default step will be used.
    //     decreaseVolume(step)	    Number	Increase volume by the specified step. If no parameter is passed, the default step will be used.
    //     toggleCaptions(toggle)   Boolean	Toggle captions display. If no parameter is passed, it will toggle based on current status.
    //     toggleControls(toggle)   Boolean	Toggle the controls (video only). Takes optional truthy value to force it on/off.
    //     on(event, function)	    String, Function	Add an event listener for the specified event.
    //     once(event, function)    String, Function	Add an event listener for the specified event once.
    //     off(event, function)	    String, Function	Remove an event listener for the specified event.
    //     supports(type)	        String	Check support for a mime type.
	//
	// List of available Getters and Setters
	//
	//     Prop     Get Set Description
	//
	//     isHTML5	✓	-	Returns a boolean indicating if the current player is HTML5.
    //     isEmbed	✓	-	Returns a boolean indicating if the current player is an embedded player.
    //     playing	✓	-	Returns a boolean indicating if the current player is playing.
    //     paused	✓	-	Returns a boolean indicating if the current player is paused.
    //     stopped	✓	-	Returns a boolean indicating if the current player is stopped.
    //     ended	✓	-	Returns a boolean indicating if the current player has finished playback.
    //     buffered	✓	-	Returns a float between 0 and 1 indicating how much of the media is buffered
    //     currentTime	✓	✓	Gets or sets the currentTime for the player. The setter accepts a float in seconds.
    //     seeking	✓	-	Returns a boolean indicating if the current player is seeking.
    //     duration	✓	-	Returns the duration for the current media.
    //     volume	✓	✓	Gets or sets the volume for the player. The setter accepts a float between 0 and 1.
    //     muted	✓	✓	Gets or sets the muted state of the player. The setter accepts a boolean.
    //     hasAudio	✓	-	Returns a boolean indicating if the current media has an audio track.
    //     speed	✓	✓	Gets or sets the speed for the player. The setter accepts a value in the options specified in your config. Generally the minimum should be 0.5.
    //     quality¹	✓	✓	Gets or sets the quality for the player. The setter accepts a value from the options specified in your config.
    //     loop	    ✓	✓	Gets or sets the current loop state of the player. The setter accepts a boolean.
    //     source	✓	✓	Gets or sets the current source for the player. The setter accepts an object. See source setter below for examples.
    //     poster	✓	✓	Gets or sets the current poster image for the player. The setter accepts a string; the URL for the updated poster image.
    //     autoplay	✓	✓	Gets or sets the autoplay state of the player. The setter accepts a boolean.
    //     currentTrack	✓	✓	Gets or sets the caption track by index. -1 means the track is missing or captions is not active
	//     language	✓	✓	Gets or sets the preferred captions language for the player. The setter accepts an ISO two-letter language code. Support for 
	//                       the languages is dependent on the captions you include. If your captions don't have any language data, or if you have multiple 
	//                       tracks with the same language, you may want to use currentTrack instead.
	//     pip	    ✓	✓	Gets or sets the picture-in-picture state of the player. The setter accepts a boolean. This currently only supported on Safari
	//                       10+ (on MacOS Sierra+ and iOS 10+) and Chrome 70+.
    //     ratio	✓	✓	Gets or sets the video aspect ratio. The setter accepts a string in the same format as the ratio option.
	//     download	✓	✓	Gets or sets the URL for the download button. The setter accepts a string containing a valid absolute URL.
	//     fullscreen.active    ✓	-	Returns a boolean indicating if the current player is in fullscreen mode.
    //     fullscreen.enabled	✓	-	Returns a boolean indicating if the current player has fullscreen enabled.
    //

	ffwd: function(seconds)
	{
		var me = this;
		
		me.logCustom("Command received - Fast Forward", 1);

		if (!me.player) {
			me.logCustom("No active player", 1);
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

		me.logCustom("Command received - Fast Forward Start", 1);
		if (!me.player) {
			me.logCustom("No active player", 1);
			return;
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

		me.logCustom("Command received - Fast Forward / Rewind Stop", 1);

		if (!me.player) {
			me.logCustom("No active player", 1);
			return;
		}

		me.stopTaskRunner();
	},


	pause: function()
	{
		var me = this;
		
		me.logCustom("Command received - Resume", 1);
		if (!me.player) {
			me.logCustom("No active player", 1);
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
		
		me.logCustom("Command received - Resume", 1);
		if (!me.player) {
			me.logCustom("No active player", 1);
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
		
		me.logCustom("Command received - Play/Pause", 1);
		if (!me.player) {
			me.logCustom("No active player", 1);
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
		
		me.logCustom("Command received - Rewind", 1);
		if (!me.player) {
			me.logCustom("No active player", 1);
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

		me.logCustom("Command received - Fast Forward", 1);
		if (!me.player) {
			me.logCustom("No active player", 1);
			return;
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
    	var me = this;

		me.plyrHTML5 = !Ext.isIE;

		me.html = me.plyrHTML5 ? '<' + me.getPlyrType() + ' id="player_' + me.getIdRoot() + '" ' +
						'controls controlsList="' + me.getAudioCtlListTags() + '" style="width:100%"> ' +
						'This browser does not support HTML 5.' +
					'</' + me.getPlyrType() + '>' : 
					//
					// IE does not support HTML5 Audio Player
					//
					'<object id="player_' + me.getIdRoot() + '" classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6" ' +
						'type="application/x-oleobject" width="100%" height="50">' +
						'<param name="autostart" value="false">' +
						'<param name="balance"   value="0">' +
						'<param name="enabled"   value="true">' +
						'<param name="url"       value="' + me.getUrl() + '">' +
						'<param name="volume"    value="100">' +
						'<param name="showstatusbar"   value="true">' +
						'<param name="currentposition" value="' + me.getCurrentTime() + '">' +
					'</object>';
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

		me.logCustom("", 1);

		if (!me.plyrHTML5)
		{
			me.logCustom("Loading Plyr Fallback Media Player", 1);
			me.logCustom("   Is IE: " + Ext.isIE.toString(), 1);
			me.player = document[me.playerId];
			if (me.player && me.getUrl())
			{
				me.player.URL = me.getUrl();
			}
			return;
		}

		me.logCustom("Loading Plyr HTML5 Media", 1);
		
		//var opts = {
		//	enabled: true,           // Whether to completely disable Plyr
		//	debug: false,            // Display debugging information in the console
		//	autoplay: false,         // Autoplay the media on load. This is generally advised against
		//	autopause: true,         // Only allow one player playing at once
		//	muted: false,            // Whether to start playback muted
		//	hideControls: true,      // Hide video controls automatically after 2s of no mouse
		//	clickToPlay: true,       // Click (or tap) of the video container will toggle play/pause
		//	disableContextMenu: true,// Disable right click menu on video
		//	resetOnEnd: false,       // Reset the playback to the start once playback is complete
		//	seekTime: 10,            // The time, in seconds, to seek when a user hits fast forward or rewind
		//	volume: 1,               // A number, between 0 and 1, representing the initial volume of the player
		//	duration: null,          // Specify a custom duration for media.
		//	invertTime: true,        // Display the current time as a countdown rather than an incremental counter
		//	// Displays the duration of the media on the "metadataloaded" event (on startup) in the current time display. 
		//	//This will only work if the preload attribute is not set to none (or is not set at all) and you choose not to 
		//	// display the duration (see controls option).
		//	displayDuration: true,   
		//	//
		//	// If a function is passed, it is assumed your method will return either an element or HTML string 
		//	// for the controls. Three arguments will be passed to your function; id (the unique id for the 
		//	// player), seektime (the seektime step in seconds), and title (the media title). See controls.md 
		//	//for more info on how the html needs to be structured.
		//	// See https://github.com/spmeesseman/plyr/blob/master/controls.md for complete list of controls
		//	//
		//	controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
		//	// If using the default controls are used then you can specify which settings to show in the menu
		//	settings: ['captions', 'quality', 'speed', 'loop'],
		//	keyboard: { focused: true, global: false }, // Enable keyboard shortcuts for focused players only or globally
		//	tooltips: { controls: false, seek: true },  // Display control labels as tooltips on :hover & :focus (by default, the labels 
		//            are screen reader only). seek: Display a seek tooltip to indicate on click where the media would seek to.
		//	storage:  { enabled: true, key: 'plyr' },   // enabled: Allow use of local storage to store user settings. key: The key name to use.
		//	captions: { active: false, language: 'auto', update: false },
		//	speed:    { selected: 1, options: [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2] }
		//};
		/*
		var controls = [
			'play-large', // The large play button in the center
			'restart', // Restart playback
			'rewind', // Rewind by the seek time (default 10 seconds)
			'play', // Play/pause playback
			'fast-forward', // Fast forward by the seek time (default 10 seconds)
			'progress', // The progress bar and scrubber for playback and buffering
			'current-time', // The current time of playback
			'duration', // The full duration of the media
			'mute', // Toggle mute
			'volume', // Volume control
			'captions', // Toggle captions
			'settings', // Settings menu
			'pip', // Picture-in-picture (currently Safari only)
			'airplay', // Airplay (currently Safari only)
			'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
			'fullscreen', // Toggle fullscreen
		];
		*/

		var opts2 = {
			// count up instead of down
			invertTime: false,
			// show duration
			controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 
			           'pip', 'airplay', 'fullscreen', 'duration', 'restart', 'rewind', 'fast-forward' ]
		};

		me.player = new Plyr('#' + me.playerId, opts2);

		if (me.getUrl())
		{
			me.logValueCustom("   Set url", me.getUrl(), 1);
			me.player.source = 
			{
				type: me.getPlyrType(),
				sources: [
				{
					src: me.getUrl()//,
					//type: 'audio/mp3',
				}]
			};
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
		me.logCustom("Event - Media player can play", 1);
		me.logValueCustom("   ID", me.playerId, 2);
		if (!me.loading && Ext.isFunction(me.onCanPlayThrough)) {
			Ext.create('Ext.util.DelayedTask', function() {
				this.onCanPlay();
			}, me).delay(100);
		}
	},


	onCanPlayThroughInternal: function(e) 
	{
		var me = this;
		me.logCustom("Event - Media player can play through", 1);
		me.logValueCustom("   ID", me.playerId, 2);
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
		me.logCustom("Event - Media player error", 1);
		me.logValueCustom("   ID", me.playerId, 2);
		if (Ext.isFunction(me.onError)) {
			me.onError();
		}
	},


	onLoadFinishedInternal: function(e) 
	{
		var me = this;
		me.logCustom("Event - First frame of media has loaded", 1);
		me.logValueCustom("   ID", me.playerId, 2);
		me.logValueCustom("   Was loading", me.loading, 2);
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
		me.logCustom("Event - Media started loading", 1);
		me.logValueCustom("   ID", me.playerId, 2);
		me.logValueCustom("   Was loading", me.loading, 2);
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

		me.logCustom("Event - Player progress", 1);
		me.logValueCustom("   ID", me.playerId, 1);

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

		me.logCustom("Event -Player initialized", 1);
		me.logValueCustom("   ID: ", me.playerId, 1);

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
		me.logCustom("Event - Media started loading", 1);
		me.logValueCustom("   ID", me.playerId, 2);
		if (Ext.isFunction(me.onStalled)) {
			me.onStalled();
		}
	},


	onStateChangedYouTubeInternal: function(e) 
	{
		var me = this;
		me.logCustom("   Media started loading", 1);
		me.logCustom("      ID: " + me.playerId, 1);
		me.logCustom("      Code: " + event.detail.code, 1);
		// -1: Unstarted, 0: Ended, 1: Playing, 2: Paused, 3: Buffering, 5: Video cued
	},


	onWaitingInternal: function(e) 
	{
		var me = this;
		me.logCustom("Event - Media waiting", 1);
		me.logValueCustom("   ID", me.playerId, 2);
		if (Ext.isFunction(me.onWaiting)) {
			me.onWaiting();
		}
	}

});
