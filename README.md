# react-map

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Map React component.

## Install ##
```javascript
npm i --save @crpt/react-map
```

## Usage

```javascript

import Map, { THEMES } from "@crpt/react-map";

<Map country="russia" region="DFO" theme={THEMES.defaultTheme} />
```

### Map

| PropName | Description | Example |
|---|---|---|
| theme: Object | Map theme object. Default: THEMES.defaultTheme | `<Map theme={myCustomTheme} />` |
| country: String  | Country name. Default: 'russia' |  `<Map country="russia" />` |
| region: String  | Country region name. Default: 'RF' |  `<Map region="DFO" />` |
| info: Array  | Map info. Note1. |  `<Map info={[{ percent: 22, region: 'DFO'}]} />` |
| favorites: Integer | Counter for Flag button | `<Map favorites={2} />` |
| scale: Float | Map custom scale. Default: 1 | `<Map scale={2.5} />` |
| scaleDelta: Float | Scale delta for increase/decrease. Default: 0.1 | `<Map scaleDelta={0.5} />` |
| onZoomInClick: Function | Callback for ZoomIn control. Receives new scale. | `<Map onZoomInClick={scale => console.log(scale)} />` |
| onZoomOutClick: Function | Callback for ZoomOut control. Receives new scale. | `<Map onZoomOutClick={scale => console.log(scale)} />` |
| onFlagClick: Function | Callback for Flag control. | `<Map onFlagClick={() => console.log('Flag clicked')} />` |
| onRegionClick: Function | Callback on map Region click. Note2 | `<Map onRegionClick={region => console.log(region.id)} />` |


__Note1__. info - array of objects
```javascript
const info = [{percent: 10, region: 'SZFO'}];
```

__Note2__. onRegionClick receives object

```javascript
{id: 'SZFO', rect: region.getBoundingClientRect(), target: {id: 'RU-SPE', rect: target.getBoundingClientRect()}}
// id - region id
// rect - region node bounding client rect
// target - clicked region, if region inside District (group of regions).
```

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
