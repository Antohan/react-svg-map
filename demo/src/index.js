import React, { Component, } from 'react';
import { render, } from 'react-dom';
import { ThemeProvider, } from 'styled-components';

import defaultTheme from '../../src/theme/defaultTheme';
import Map from '../../src';


const initialInfo = [
];

const info = {
  'RF': [
    { percents: [12, ], region: 'SZFO', },
    { percents: [31, 41, ], region: 'RU-AL', },
    { percents: [45, 23, 11, ], region: 'RU-SA', },
    { percents: [11, 66, 33, 77, ], region: 'YFO', },
  ],
  'SZFO': [
    { percents: [12, ], region: 'RU-KR', },
    { percents: [31, 41, ], region: 'RU-ARK', },
    { percents: [45, 23, 11, ], region: 'RU-LEN', },
    { percents: [11, 66, 33, 77, ], region: 'RU-NGR', },
  ],
};

const theme = {
  Map: {
    Info: {
      normal: {
        backgroundFillLow: '#0f0',
        backgroundFillMedium: '#00f',
        backgroundFillHigh: '#f00',
      },
    },
    Region: {
      hover: {
        fill: '#990',
      },
      active: {
        fill: '#099',
      },
    },
  },
};


class Demo extends Component {
  state = {
    info: info['RF'],
  };

  onRegionClick = (region) => {
    this.setState({ region: region.id, info: info[region.id] });
  };

  onFlagClick = () => {
    this.setState({ region: 'RF', info: info['RF'], });
  };

  render() {
    const { info, region, } = this.state;

    return (
      <div style={{ width: '100%', height: '700px', }}>
        <h1>
          react-svg-map Demo
        </h1>
        <div style={{ width: '100%', height: '600px', }}>
          <Map
            theme={theme}
            country="russia"
            region={region}
            info={info}
            favorites={2}
            onRegionClick={this.onRegionClick}
            onFlagClick={this.onFlagClick}
            onInfoClick={e => console.log(e)}
          />
        </div>
      </div>
    );
  }
}

render(
  <ThemeProvider theme={defaultTheme}>
    <Demo />
  </ThemeProvider>,
  window.document.querySelector('#demo'),
);
