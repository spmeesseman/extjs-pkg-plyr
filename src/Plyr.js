Ext.define('Ext.ux.Plyr', 
{
    extend: 'Ext.Component',
    xtype: 'plyr',
	
	player: null,
	playerId: null,
    plyrInitialized: false,
    intializationInProgress: 0,
    reference: 'player',
    autoHeight: true,
    border:false,
    style: 
    {
    	padding: '0 0 0 0',
    	border: '0'
    },

	plyrOnLoaded: Ext.emptyFn,
	plyrLog: Ext.emptyFn,

    statics:
    {
    	imgPath: 'resources/images',
		scriptLoaded: 0,
		playerIdCounter: 0,
    	captureActivity: 
    	{
    		fn: Ext.emptyFn,
    		scope: null
    	}
    },

    config:
    {
        url: '',
        idRoot: 0,
        audioCtlListTags: '',
        currentTime: 0,
        playbackSpeed: 1
    },

    publishes:
    {
        url: true,
        idRoot: true,
        audioCtlListTags: true,
        currentTime: true
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
	
	bind:
    {
        html: !Ext.isIE ? 
        //
        // Non-IE
        //
        '<audio id="player_{player.idRoot}" src="{player.url}" controls controlsList="{player.audioCtlListTags}" ' +
        'currenttime="{player.currentTime}" style="width:100%">This browser does not support HTML 5.</audio>' : 
        //
        // IE does not support HTML5 Audio Player
        //
        '<object id="player_{player.idRoot}" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" '+
            'codebase="http://www.apple.com/qtactivex/qtplugin.cab" width="100%" height="50">' +
            '<param name="src" value="{player.url}">' +
            '<param name="autoplay" value="false">' +
            '<embed type="audio/x-wav" src="{player.url}" autoplay="false" autostart="false" width="100%" height="50">' +
        '</object>'
	},
	
	listeners:
	{
		destroy: function(cmp, eopts)
		{
			var me = this;
			if (me.player) {
				me.player.destroy();
			}
		}
	},

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


	taskRunner: null,
	taskRunnerTask: null,

	ffwd: function(seconds)
	{
		var me = this;
		
		if (me.plyrLog) {
			me.plyrLog("PLYR: Command received - Fast Forward", 1);
		}
		if (!me.player) {
			if (me.plyrLog) {
				me.plyrLog("PLYR: No active player", 1);
			}
			return;
		}

		if (!seconds) {
			seconds = 2;
		}

		me.stopTaskRunner();

		me.player.forward(seconds);
	},


	ffwdStart: function(seconds, stepms)
	{
		var me = this;

		if (me.plyrLog) {
			me.plyrLog("PLYR: Command received - Fast Forward Start", 1);
		}
		if (!me.player) {
			if (me.plyrLog) {
				me.plyrLog("PLYR: No active player", 1);
			}
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
				me.player.forward(seconds);
			},
			interval: stepms ? stepms : 500
		});
	},


	ffwdRwdStop: function()
	{
		var me = this;

		if (me.plyrLog) {
			me.plyrLog("PLYR: Command received - Fast Forward / Rewind Stop", 1);
		}
		if (!me.player) {
			if (me.plyrLog) {
				me.plyrLog("PLYR: No active player", 1);
			}
			return;
		}

		me.stopTaskRunner();
	},


	pause: function()
	{
		var me = this;
		
		if (me.plyrLog) {
			me.plyrLog("PLYR: Command received - Resume", 1);
		}
		if (!me.player) {
			if (me.plyrLog) {
				me.plyrLog("PLYR: No active player", 1);
			}
			return;
		}

		me.stopTaskRunner();

		me.player.pause();
	},


	play: function()
	{
		var me = this;
		
		if (me.plyrLog) {
			me.plyrLog("PLYR: Command received - Resume", 1);
		}
		if (!me.player) {
			if (me.plyrLog) {
				me.plyrLog("PLYR: No active player", 1);
			}
			return;
		}

		me.stopTaskRunner();

		me.player.play();
	},


	togglePlay: function()
	{
		var me = this;
		
		if (me.plyrLog) {
			me.plyrLog("PLYR: Command received - Play/Pause", 1);
		}
		if (!me.player) {
			if (me.plyrLog) {
				me.plyrLog("PLYR: No active player", 1);
			}
			return;
		}

		me.stopTaskRunner();

		me.player.togglePlay();
	},


	rwd: function(seconds)
	{
		var me = this;
		
		if (me.plyrLog) {
			me.plyrLog("PLYR: Command received - Rewind", 1);
		}
		if (!me.player) {
			if (me.plyrLog) {
				me.plyrLog("PLYR: No active player", 1);
			}
			return;
		}

		if (!seconds) {
			seconds = 2;
		}

		me.stopTaskRunner();

		me.player.rewind(seconds);
	},


	rwdStart: function(seconds, stepms)
	{
		var me = this;

		if (me.plyrLog) {
			me.plyrLog("PLYR: Command received - Fast Forward", 1);
		}
		if (!me.player) {
			if (me.plyrLog) {
				me.plyrLog("PLYR: No active player", 1);
			}
			return;
		}

		me.stopTaskRunner();

		me.player.rewind(seconds);

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


	afterRender: function() 
    {
    	var me = this;
    	me.callParent(arguments);

		if (me.plyrLog) {
			me.plyrLog("", 1);
		}

		if (Ext.isIE) {
			if (me.plyrLog) {
				me.plyrLog("HTML5 audio is not supported in IE.  Fall back to apple/qtplugin", 1);
			}
			return;
		}

		if (me.plyrLog) {
			me.plyrLog("Loading Plyr HTML5 Media", 1);
		}

    	//
    	// Load script
    	//
    	if (!Ext.ux.Plyr.sriptLoaded)
    	{
    		new Ext.util.DelayedTask(function()
    		{
    			Ext.Loader.loadScript(
    			{
    				url: Ext.manifest.resources.base + '/plyr/plyr.js',
    				//charset: 'UTF-8',
    				onLoad: me.onLoadSuccess,
    				onError: me.onLoadError,
    				scope: me
    			});

    		}, me).delay(5);
    	}
    	else
    	{
    		new Ext.util.DelayedTask(function()
    		{
				me.onLoadSuccess();
			}, me).delay(25);
    	}
    },


    //
    // Callback function for loading the TinyMCEscript
    //
    onLoadError: function() 
    {
		var me = this;
		if (me.plyrLog) {
			if (!Ext.ux.Plyr.sriptLoaded)
				me.plyrLog("   Error loading JS", 1);
			else if (Ext.ux.Plyr.sriptLoaded === 1)
				me.plyrLog("   Error loading CSS", 1);
		}
    },


    //
    // Calback function for successfully loading TinyMCE script
    //
    onLoadSuccess: function() 
    {
    	var me = this;
		if (!Ext.ux.Plyr.sriptLoaded) 
		{
			if (me.plyrLog) {
				me.plyrLog("   JS loaded", 1);
			}
			//
			// Load the CSS
			//
			Ext.ux.Plyr.sriptLoaded = 1;
			new Ext.util.DelayedTask(function()
    		{
    			Ext.Loader.loadScript(
    			{
    				url: Ext.manifest.resources.base + '/plyr/plyr.css',
    				//charset: 'UTF-8',
    				onLoad: me.onLoadSuccess,
    				onError: me.onLoadError,
    				scope: me
    			});
    		}, me).delay(5);
    	}
    	else if (Ext.ux.Plyr.sriptLoaded === 1)
    	{
			//
			// JS and CSS both loaded, initialize the plyr component
			//
			if (me.plyrLog) {
				me.plyrLog("   CSS loaded", 1);
			}
			Ext.ux.Plyr.sriptLoaded = true;
			me.onLoadSuccess(); // re-call with new scriptLoaded param set
    	}
		else if (Ext.ux.Plyr.sriptLoaded === true)
		{
			var opts = {
				enabled: true,           // Whether to completely disable Plyr
				debug: false,            // Display debugging information in the console
				autoplay: false,         // Autoplay the media on load. This is generally advised against
				autopause: true,         // Only allow one player playing at once
				muted: false,            // Whether to start playback muted
				hideControls: true,      // Hide video controls automatically after 2s of no mouse
				clickToPlay: true,       // Click (or tap) of the video container will toggle play/pause
				disableContextMenu: true,// Disable right click menu on video
				resetOnEnd: false,       // Reset the playback to the start once playback is complete
				seekTime: 10,            // The time, in seconds, to seek when a user hits fast forward or rewind
				volume: 1,               // A number, between 0 and 1, representing the initial volume of the player
				duration: null,          // Specify a custom duration for media.
				displayDuration: true,   // Displays the duration of the media on the "metadataloaded" event (on startup) in the current time display. This will only work if the preload attribute is not set to none (or is not set at all) and you choose not to display the duration (see controls option).
				invertTime: true,        // Display the current time as a countdown rather than an incremental counter
				//
				// If a function is passed, it is assumed your method will return either an element or HTML string 
				// for the controls. Three arguments will be passed to your function; id (the unique id for the 
				// player), seektime (the seektime step in seconds), and title (the media title). See controls.md 
				//for more info on how the html needs to be structured.
				//
				controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
				// If using the default controls are used then you can specify which settings to show in the menu
				settings: ['captions', 'quality', 'speed', 'loop'],
				keyboard: { focused: true, global: false }, // Enable keyboard shortcuts for focused players only or globally
				tooltips: { controls: false, seek: true },  // Display control labels as tooltips on :hover & :focus (by default, the labels are screen reader only). seek: Display a seek tooltip to indicate on click where the media would seek to.
				storage:  { enabled: true, key: 'plyr' },   // enabled: Allow use of local storage to store user settings. key: The key name to use.
				captions: { active: false, language: 'auto', update: false }
			};

			//me.player = new Plyr('#' + me.playerId, opts);
			me.player = new Plyr('#' + me.playerId);

			if (me.plyrLog) {
				me.plyrLog("    Player initialized", 1);
				me.plyrLog("       ID: " + me.playerId, 1);
			}
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
		}
	}
});
