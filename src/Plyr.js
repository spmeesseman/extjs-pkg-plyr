
Ext.define('Ext.plyr.Plyr', 
{
    extend: 'Ext.Container',
    xtype: 'plyr',
	
	player: null,

    /*
    Flag for tracking the initialization state
     */
    wysiwygIntialized: false,
    intializationInProgress: false,

    lastHeight: null,
    lastFrameHeight: null,

    /*
    In the ExtJS 5.x, the liquid layout is used if possible. 
    The liquid layout means that the component is rendered
    with the help of pure CSS without any JavaScript. In this 
    case, no sizing events are fired.

    However, the event 'resize' is essential for the 
    Ext.ux.form.TinyMCETextArea. For that reason, we set 
    liquidLayout to false.
     */
    liquidLayout: false,

    //
    // 
    //
    editorLoaded: Ext.emptyFn,

    privates:
    {
    	//editorLoadingMask: false,
    	initialValue: null,
    	initialValueSet: false
    },

    //
    // Custom static properties
    //
    statics:
    {
    	imgPath: 'resources/images',
    	scriptLoaded: false,
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

    afterRender: function () 
    {
    	var me = this;
    	me.callParent(arguments);

    	//
    	// Load script
    	//
    	if (!Ext.tinymce.TinyMceEditor.sriptLoaded)
    	{
    		new Ext.util.DelayedTask(function()
    		{
    			//me.editorLoadingMask = ToolkitUtils.mask(me, 'Loading editor...');

    			Ext.Loader.loadScript(
    			{
    				url: Ext.manifest.resources.base + '/plyr/plyr.js',
    				//charset: 'UTF-8',
    				onLoad: me.onLoadSuccess,
    				onError: me.onLoadError,
    				scope: me
    			});

    		}, me).delay(500);
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
    	Utils.logError("There was an error loading the TinyMCE script");
    },


    //
    // Calback function for successfully loading TinyMCE script
    //
    onLoadSuccess: function() 
    {
    	var me = this;

    	if (!Ext.tinymce.TinyMceEditor.sriptLoaded)
    	{
    		Utils.log("Plyr HTML5 Media - Script loaded");
    	}

    	//ToolkitUtils.unmask(me.editorLoadingMask);

    	me.on('blur', function(elm, ev, eOpts) 
    	{
    		var ctrl = document.getElementById(me.getInputId());

    		if (me.wysiwygIntialized) 
    		{
    			var ed = tinymce.get(me.getInputId());
    			//
    			// In the HTML text modus, the contents should be synchronized upon the blur event
    			//
    			if (ed && ed.isHidden()) 
    			{
    				if (ctrl) 
    				{
    					me.positionBeforeBlur = { start: ctrl.selectionStart, end: ctrl.selectionEnd };
    				}
    				ed.load();
    			}
    		}
    		else if (ctrl) 
    		{
    			me.positionBeforeBlur = { start: ctrl.selectionStart, end: ctrl.selectionEnd };
    		}
    		else
    		{
    			Utils.logError("TinyMCE Editor - Control element not found");
    		}
    	}, me);

    	if (!me.noWysiwyg && !me.wysiwygIntialized) 
    	{
    		me.initEditor(me.getHeight());
    		if (me.initialValue)
    		{
    			me.setValue(me.initialValue);
    			me.initialValue = null;
    		}
    	}

    	Ext.tinymce.TinyMceEditor.sriptLoaded = true;

    	/*
    	 * ExtJs 6.5 - removed 'resize' event, need to now use onResize() override
    	 * 
       me.on('resize', function (elm, width, height, oldWidth, oldHeight, eOpts) 
       {

    	   if (!me.noWysiwyg && !me.wysiwygIntialized) 
           {
               me.initEditor(height);
           }
           else
           {
               me.syncEditorHeight(height);
           }
       }, me);*/
    },


    onResize: function(width, height, oldWidth, oldHeight)
    {
    	var me = this;
    	me.callParent(arguments);

    	if (!Ext.tinymce.TinyMceEditor.sriptLoaded)
    	{
    		return;
    	}

    	if (!me.noWysiwyg && !me.wysiwygIntialized) 
    	{
    		me.initEditor(height);
    	}
    	else
    	{
    		me.syncEditorHeight(height);
    	}

    },


    syncEditorHeight: function (height) 
    {
    	var me = this;

    	me.lastHeight = height;

    	if (!me.wysiwygIntialized || !me.rendered) { return; }

    	var ed = tinymce.get(me.getInputId());

    	// if the editor is hidden, we do not syncronize
    	// because the size values of the hidden editor
    	// are calculated wrong.

    	if (ed.isHidden()) { return; }

    	var edIframe = Ext.get(me.getInputId() + "_ifr");

    	var parent = edIframe.up(".mce-edit-area");
    	parent = parent.up(".mce-container-body");

    	var newHeight = height;

    	var edToolbar = parent.down(".mce-toolbar-grp");
    	if(edToolbar) 
    		newHeight -= edToolbar.getHeight();

    	var edMenubar = parent.down(".mce-menubar");
    	if(edMenubar) 
    		newHeight -= edMenubar.getHeight();

    	var edStatusbar = parent.down(".mce-statusbar");
    	if(edStatusbar) 
    		newHeight -= edStatusbar.getHeight();

    	me.lastFrameHeight = newHeight - 3;

    	edIframe.setHeight(newHeight - 3);

    	return newHeight - 3;
    },


    showBorder: function(state) 
    {
    	var me = this;

    	var elm = Ext.getDom(me.getId() + "-inputWrap");
    	if(!elm) return;

    	if(state) elm.classList.remove("tinymce-hide-border");
    	else      elm.classList.add("tinymce-hide-border");

    	var elm = Ext.getDom(me.getId() + "-triggerWrap");
    	if(!elm) return;

    	if(state) elm.classList.remove("tinymce-hide-border");
    	else      elm.classList.add("tinymce-hide-border");
    },


    initEditor: function (height) 
    {

    	var me = this;

    	if (me.intializationInProgress || me.wysiwygIntialized) { return; }

    	me.intializationInProgress = true;

    	me.player = new Plyr('#player');

    	me.intializationInProgress = false;
    	me.wysiwygIntialized = true;
    }

});

