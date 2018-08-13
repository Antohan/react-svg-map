# react-svg-map

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

SVG Map React component.

## Install ##
```javascript
npm i --save @crpt/react-svg-map
```

## Usage

```javascript

import Map, { THEMES } from "@crpt/react-svg-map";

<Map country="russia" selectedId="DFO" theme={THEMES.defaultTheme} />
```

### Map

| PropName | Description | Example |
|---|---|---|
| theme: Object | Map theme object. Default: THEMES.defaultTheme | `<Map theme={myCustomTheme} />` |
| country: String  | Country name. Default: 'russia' |  `<Map country="russia" />` |
| region: String  | Country region id. Default: 'RF' |  `<Map region="DFO" />` |
| info: Array  | Map info. Note1. |  `<Map info={[{ percent: 22, region: 'DFO'}]} />` |
| favorites: Integer | Counter for Flag button | `<Map favorites={2} />` |
| onZoomInClick: Function | Callback for ZoomIn control. Receives new scale. | `<Map onZoomInClick={scale => console.log(scale)} />` |
| onZoomOutClick: Function | Callback for ZoomOut control. Receives new scale. | `<Map onZoomOutClick={scale => console.log(scale)} />` |
| onFlagClick: Function | Callback for Flag control. | `<Map onFlagClick={() => console.log('Flag clicked')} />` |
| onRegionClick: Function | Callback on map Region click. Note2 | `<Map onRegionClick={region => console.log(region.id)} />` |
| onInfoClick: Function | Callback on Info click. Receives region ID | `<Map onInfoClick={region => console.log(region)>` |

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
