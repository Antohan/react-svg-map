import React, { Component, } from 'react';
import { render, } from 'react-dom';
import { ThemeProvider, } from 'styled-components';

import defaultTheme from '../../src/theme/defaultTheme';
import Map from '../../src';


const initialInfo = [
];

const info = [
  { percents: [12, ], region: 'SZFO', owner: 'RF' },
  { percents: [31, 41, ], region: 'RU-AL', owner: 'RF' },
  { percents: [45, 23, 11, ], region: 'RU-SA', owner: 'RF' },
  { percents: [11, 66, 33, 77, ], region: 'YFO', owner: 'RF' },
  { percents: [12, ], region: 'RU-KR', owner: 'SZFO', },
  { percents: [31, 41, ], region: 'RU-ARK', owner: 'SZFO', },
  { percents: [45, 23, 11, ], region: 'RU-LEN', owner: 'SZFO', },
  { percents: [11, 66, 33, 77, ], region: 'RU-NGR', owner: 'SZFO', },
];

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
    info: info,
    showInfoLegend: false,
    infoLegendId: null,
  };

  wrapRef = React.createRef();

  onRegionClick = (clicked) => {
    const { region } = this.state;

    if (clicked.target && clicked.id === region && region && region !== 'RF') {
      this.setState({
        showInfoLegend: true,
        infoLegendId: clicked.target.id,
      });
      return false;
    }

    this.setState({ region: clicked.id });
    return true;
  };

  onFlagClick = () => {
    this.setState({ region: 'RF', info: null, showInfoLegend: false}, () => {
      this.setState({ region: 'RF', info: info });
    });
  };

  onZoomClick = () => this.setState({ showInfoLegend: false });

  renderInfoLegend = () => {
    const { showInfoLegend, infoLegendId } = this.state;
    const { info } = this.state;
    if (!showInfoLegend ) return (null);
    const infoData = info.find(i => i.region === infoLegendId);
    if (!infoData) return (null);

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
