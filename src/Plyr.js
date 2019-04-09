Ext.define('Ext.plyr.Plyr', 
{
    extend: 'Ext.Component',
    xtype: 'plyrext',
	
	player: null,
    plyrInitialized: false,
    intializationInProgress: 0,

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

    autoHeight: true,
    border:false,
    style: 
    {
    	padding: '0 0 0 0',
    	border: '0'
    },

	reference: 'player',

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
		this.idRoot = Ext.plyr.Plyr.playerIdCounter;
        return this.idRoot;
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
	
    afterRender: function() 
    {
    	var me = this;
    	me.callParent(arguments);

		me.plyrLog("", 1);
		me.plyrLog("Loading Plyr HTML5 Media", 1);

    	//
    	// Load script
    	//
    	if (!Ext.plyr.Plyr.sriptLoaded)
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
    		me.onLoadSuccess();
    	}
    },


    //
    // Callback function for loading the TinyMCEscript
    //
    onLoadError: function() 
    {
		var me = this;
		if (!Ext.plyr.Plyr.sriptLoaded)
			me.plyrLog("   Error loading JS", 1);
		else if (Ext.plyr.Plyr.sriptLoaded === 1)
			me.plyrLog("   Error loading CSS", 1);
    },


    //
    // Calback function for successfully loading TinyMCE script
    //
    onLoadSuccess: function() 
    {
    	var me = this;
		if (!Ext.plyr.Plyr.sriptLoaded) 
		{
			me.plyrLog("   JS loaded", 1);
			//
			// Load the CSS
			//
			Ext.plyr.Plyr.sriptLoaded = 1;
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
    	else if (Ext.plyr.Plyr.sriptLoaded === 1)
    	{
			//
			// JS and CSS both loaded, initialize the plyr component
			//
			me.plyrLog("   CSS loaded", 1);
			Ext.plyr.Plyr.sriptLoaded = true;
			me.player = new Plyr('#player_' + Ext.plyr.Plyr.playerIdCounter);
			Ext.plyr.Plyr.playerIdCounter++;
			me.plyrLog("    Player initialized", 1);

			//console.log(me.player);
    	}
	}
});
