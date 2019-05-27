# ExtJs Package Wrapper for plyr

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![app-publisher](https://app1.development.pjats.com/res/img/app-publisher-badge.svg)](https://npm.development.pjats.com/-/web/detail/@perryjohnson/app-publisher)

## Description

> This package provides an ExtJS package wrapper for the [plyr html5 media player](https://github.com/sampotts/plyr) by [Sam Potts](https://github.com/sampotts), available on [npmjs.org](https://www.npmjs.com/package/plyr).  The plyr package is used as a dependency and this package will include its distribution files into ExtJs client builds.

## Install

To install this package, run the following command:

    npm install @perryjohnson/extjs-pkg-plyr

## Usage

To include the package in an ExtJS application build, be sure to add the package name to the list of required packages in the app.json file:

    "requires": [
         "plyr",
        ...
    ]

For an open tooling build, also add the node_modules path to the workspace.json packages path array:

     "packages": {
        "dir": "...${package.dir}/node_modules/@perryjohnson/extjs-pkg-plyr"
    }

Simply include the control into any class file:

    require: [ 'Ext.plyr.Plyr' ],
    items: [
    {
        xtype: 'plyr',
        audioCtlListTags: 'download',
        currentTime: 0,
        url: 'https://www.mydomain.com/audio/blank.mp4',
        plyrLoaded: function()         // Optional callback
        {
            Utils.log('Loaded!!!');
        },
        plyrLog: function(msg, level)  // Optional callback
        {
            Utils.log(msg, level);
        }
    }]
