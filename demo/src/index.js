import React, { Component } from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';

import defaultTheme from '../../src/theme/defaultTheme';
import Map from '../../src';


const initialInfo = [
  { percent: 12, region: 'SZFO' },
  { percent: 31, region: 'RU-AL' },
  { percent: 53, region: 'RU-SA' },
];

const theme = {
  Map: {
    Info: {
      normal: {
        backgroundFillLow: '#0f0',
        backgroundFillMedium: '#f00',
        backgroundFillHigh: '#00f',
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
    info: initialInfo,
    region: 'RF',
  };

  componentDidMount() {
    const { info } = this.state;
    setTimeout(() => this.setState({ info: [...info, { percent: 80, region: 'CFO' }] }), 2000);
  }

  onRegionClick = (region) => {
    this.setState({ region: region.id });
  };

  onFlagClick = () => {
    this.setState({ region: 'RF' });
  };

  render() {
    const { info, region } = this.state;

    return (
      <div style={{ width: '100%', height: '700px' }}>
        <h1>
          react-map Demo
        </h1>
        <div style={{ width: '100%', height: '600px' }}>
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
