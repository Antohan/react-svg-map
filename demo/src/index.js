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
        usePercentColor: false,
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
    showInfoLegend: false,
    infoLegendId: null,
  };

  wrapRef = React.createRef();

  onRegionClick = (region) => {
    this.setState({ region: region.id, info: info[region.id], showInfoLegend: false });
  };

  onFlagClick = () => {
    this.setState({ region: 'RF', info: null, showInfoLegend: false}, () => {
      this.setState({ region: 'RF', info: info['RF'] });
    });
  };

  onZoomClick = () => this.setState({ showInfoLegend: false });

  onInfoClick = ({ id }) => {
    this.setState((oldState) => {
      if (oldState.showInfoLegend) return { showInfoLegend: false };
      const rect = this.wrapRef.current.querySelector(`#info-${id}`);
      return { showInfoLegend: true, infoLegendId: id };
    });
  };

  renderInfoLegend = () => {
    const { showInfoLegend, infoLegendId } = this.state;
    if (!showInfoLegend) return (null);
    const wrapRect = this.wrapRef.current.getBoundingClientRect();
    const infoRect = this.wrapRef.current.querySelector(`#info-${infoLegendId}`).getBoundingClientRect();

    return (
      <div
        style={{
          position: 'absolute',
          top: `${infoRect.y - wrapRect.y - 125}px`,
          left: `${infoRect.x - wrapRect.x - 25 + infoRect.height}px`,
          width: '100px',
          height: '100px',
          backgroundColor: 'white',
        }}
      >
        <div>Info 1: 100</div>
        <div>Info 2: 200</div>
        <div>Info 3: 300</div>
        <div>Info 4: 400</div>
      </div>
    );
  };

  render() {
    const { info, region, } = this.state;

    return (
      <div style={{ width: '100%', height: '700px', }}>
        <h1>
          react-svg-map Demo
        </h1>
        <div style={{ width: '100%', height: '800px', position: 'relative' }} ref={this.wrapRef}>
          <Map
            theme={theme}
            country="russia"
            region={region}
            info={info}
            favorites={2}
            onRegionClick={this.onRegionClick}
            onFlagClick={this.onFlagClick}
            onInfoClick={this.onInfoClick}
            onZoomOutClick={this.onZoomClick}
            onZoomInClick={this.onZoomClick}
          />
          {this.renderInfoLegend()}
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
