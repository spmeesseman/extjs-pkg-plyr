# EXTJS-PKG-PLYR CHANGE LOG

## Version 1.2.1 (May 28th, 2019)

### Build System

- **npm:** fix app-publisher script arguments
- **npm:** fix invalid attribute publisher->author [skip ci]
- **npm:** package.json cleanup [skip ci]
- **npm:** switch to perryjohnson scope from testing scope
- modify script to replace speed rates in plyr source

### Chores

- 1.0.11 post release check in
- 1.2.0 release update
- add node_modules folder to ignore list
- prep file check in for first app-publisher release
- set scope name

### Features

- add additional speed playback rates to menuSpeed rates are now 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2
- initial check in tested npm package project

### Bug Fixes

- include plyr release files in package

### Code Styling

- ignore unused files

### Tests

- scoped package

### Other Notes

- scoped package

# [1.2.0](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.1.0...v1.2.0) (2019-05-04)


### Features

* add additional speed steps 0.6, 0.7, 0.8, 0.9 ([0ecc9b6](https://github.com/spmeesseman/extjs-pkg-plyr/commit/0ecc9b6))

# [1.1.0](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.15...v1.1.0) (2019-05-03)


### Features

* emit onLoaded and onProgress events for ui to consume ([ada5c13](https://github.com/spmeesseman/extjs-pkg-plyr/commit/ada5c13))

## [1.0.15](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.14...v1.0.15) (2019-05-03)


### Bug Fixes

* copy plyr dist from new local package dir on sencha app build ([1d18cf9](https://github.com/spmeesseman/extjs-pkg-plyr/commit/1d18cf9))

## [1.0.14](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.13...v1.0.14) (2019-05-03)


### Bug Fixes

* include plyr files in package, not as separate dependency ([e1b9f0a](https://github.com/spmeesseman/extjs-pkg-plyr/commit/e1b9f0a))


### Build System

* **npm:** back to non-scoped conventional-changelog-spm ([e2372cc](https://github.com/spmeesseman/extjs-pkg-plyr/commit/e2372cc))

## [1.0.13](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.12...v1.0.13) (2019-05-02)


### Bug Fixes

* include plyr files in package, not as separate dependency ([0ac7e3f](https://github.com/spmeesseman/extjs-pkg-plyr/commit/0ac7e3f))

## [1.0.12](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.11...v1.0.12) (2019-05-01)


### Code Refactoring

* make package scoped ([6180d14](https://github.com/spmeesseman/extjs-pkg-plyr/commit/6180d14))

## [1.0.11](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.10...v1.0.11) (2019-04-30)


### Code Refactoring

* remove build.xml from release package ([a1684e5](https://github.com/spmeesseman/extjs-pkg-plyr/commit/a1684e5))


### Documentation

* **readme:** remove testing info ([81658a4](https://github.com/spmeesseman/extjs-pkg-plyr/commit/81658a4))

## [1.0.10](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.9...v1.0.10) (2019-04-30)


### Bug Fixes

* stop running rwd/ffwd timer on any new command ([79f4fc7](https://github.com/spmeesseman/extjs-pkg-plyr/commit/79f4fc7))


### Documentation

* **readme:** update builds list [skip ci] ([406aff8](https://github.com/spmeesseman/extjs-pkg-plyr/commit/406aff8))

## [1.0.9](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.8...v1.0.9) (2019-04-24)


### Bug Fixes

* undefined property Plyr when loading ([13bb3ec](https://github.com/spmeesseman/extjs-pkg-plyr/commit/13bb3ec))

## [1.0.8](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.7...v1.0.8) (2019-04-23)


### Bug Fixes

* first set of issues in first plyr implementation are resolved, first working built out api at extjs component level ([d834b3c](https://github.com/spmeesseman/extjs-pkg-plyr/commit/d834b3c))


### Build System

* **npm:** update security vulnerablities.  manual changes needed for tar vulnerability. ([c1f2e8d](https://github.com/spmeesseman/extjs-pkg-plyr/commit/c1f2e8d))
* **semantic-release:** add featmin keyword to commit-analyzer ([0d547c8](https://github.com/spmeesseman/extjs-pkg-plyr/commit/0d547c8))


### Code Refactoring

* change namespace/component name from Ext.plyr.Plyr to Ext.ux.Plyr ([774cf66](https://github.com/spmeesseman/extjs-pkg-plyr/commit/774cf66))


### Documentation

* **readme:** update build by me section ([f84abe3](https://github.com/spmeesseman/extjs-pkg-plyr/commit/f84abe3))

## [1.0.7](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.6...v1.0.7) (2019-04-19)


### Documentation

* **readme:** add Greenkeeper badge ([e661d77](https://github.com/spmeesseman/extjs-pkg-plyr/commit/e661d77))

## [1.0.6](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.5...v1.0.6) (2019-04-10)


### Bug Fixes

* cant load more than one player instance ([1656edf](https://github.com/spmeesseman/extjs-pkg-plyr/commit/1656edf))


### Documentation

* **readme:** update credits info of ply developer and project [skip ci] ([aadbf89](https://github.com/spmeesseman/extjs-pkg-plyr/commit/aadbf89))

## [1.0.5](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.4...v1.0.5) (2019-04-09)


### Bug Fixes

* expose dom playerid as a component property, null check log and onload callbacks ([eef183e](https://github.com/spmeesseman/extjs-pkg-plyr/commit/eef183e))

## [1.0.4](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.3...v1.0.4) (2019-04-09)


### Bug Fixes

* remove unnecessary workspace file ([063590c](https://github.com/spmeesseman/extjs-pkg-plyr/commit/063590c))

## [1.0.3](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.2...v1.0.3) (2019-04-09)


### Bug Fixes

* fall back to apple/qtplugin player for IE ([31f2894](https://github.com/spmeesseman/extjs-pkg-plyr/commit/31f2894))


### Documentation

* **readme:** update example ([df2b04a](https://github.com/spmeesseman/extjs-pkg-plyr/commit/df2b04a))

## [1.0.2](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.1...v1.0.2) (2019-04-09)


### Bug Fixes

* component should have plyr xtype ([dd8de27](https://github.com/spmeesseman/extjs-pkg-plyr/commit/dd8de27))

## [1.0.1](https://github.com/spmeesseman/extjs-pkg-plyr/compare/v1.0.0...v1.0.1) (2019-04-09)


### Bug Fixes

* plyr base files not copied to ExtJS client build ([6344ae4](https://github.com/spmeesseman/extjs-pkg-plyr/commit/6344ae4))

# 1.0.0 (2019-04-09)


### Code Refactoring

* update wrapper - 2nd round of testing ([9a43366](https://github.com/spmeesseman/extjs-pkg-plyr/commit/9a43366))

