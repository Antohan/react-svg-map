import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import {select} from 'd3';
import styled, { withTheme, ThemeProvider, } from 'styled-components';
import {getScale, getPosition, getTheme, getGlobalTheme, getFlatMap} from '../utils';
import { defaultTheme, } from '../theme';

import * as Maps from './Data';
import { Controls, } from './Controls';
import Background from './Background';
import District from './Regions/District';
import Info from './Info';


const Wrap = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: ${props => props.backgroundFill};
`;

const RegionsWrap = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100%;
  max-height: 100%;
`;


class Map extends PureComponent {
  static displayName = 'Map';

  static propTypes = {
    theme: PropTypes.object,
    country: PropTypes.string,
    region: PropTypes.string,
    info: PropTypes.arrayOf(PropTypes.shape({
      percents: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
      region: PropTypes.string.isRequired,
    })),
    favorites: PropTypes.number,
    onZoomInClick: PropTypes.func,
    onZoomOutClick: PropTypes.func,
    onFlagClick: PropTypes.func,
    onRegionClick: PropTypes.func,
    onInfoClick: PropTypes.func,
  };

  static defaultProps = {
    theme: defaultTheme,
    country: 'russia',
    region: null,
    favorites: null,
    info: [],
    onZoomInClick: null,
    onZoomOutClick: null,
    onFlagClick: null,
    onRegionClick: null,
    onInfoClick: null,
  };

  state = {
    map: Maps[this.props.country],
    flatMap: getFlatMap(Maps[this.props.country]),
    theme: getTheme(getGlobalTheme(this.props.theme), 'Map'),
  };

  wrapRef = React.createRef();
  regionsNode = null;
  regionsRef = React.createRef();
  infoRefs = {};

  animationInterval = null;
  lastScale = 1;
  lastX = 0;
  lastY = 0;

  componentDidMount() {
    const { region } = this.props;
    if (region) this.zoomToSelectedId(region);
    else this.animateInfoTranslation();
  }

  componentDidUpdate(prevProps) {
    console.log(this.props);
    const { region } = this.props;
    if (region !== prevProps.region) {
      this.zoomToSelectedId(region);
    }
  }

  animateTranslation = (scale, x, y) => {
    this.regionsNode
      .transition()
      .duration(750)
      .attr('transform', `scale(${scale})translate(${x} ${y})`)
      .on('end', this.animateInfoTranslation);
    this.lastScale = scale;
    this.lastX = x;
    this.lastY = y;
  };

  animateInfoTranslation = () => {
    const wrapRect = this.wrapRef.current.getBoundingClientRect();
    Object.keys(this.infoRefs).forEach((key) => {
      const { node, regionNode, center } = this.infoRefs[key];
      const rect = regionNode.getBoundingClientRect();
      const newX = (rect.x - wrapRect.x) + rect.width / 2 - center;
      const newY = (rect.y - wrapRect.y) + rect.height / 2;
      node.style.top = `${newY}px`;
      node.style.left = `${newX}px`;
    });
  };

  zoomToSelectedId = (id) => {
    const { map, flatMap } = this.state;
    let region = flatMap[id];
    if (!region) region = map;

    const scale = getScale(map.size, region.size);

    this.animateTranslation(scale, ...getPosition(map.center, region.center));
  };

  onRegionClick = (region) => {
    const { onRegionClick } = this.props;
    if (onRegionClick) onRegionClick(region);
    this.zoomToSelectedId(region.id);
  };

  onZoomInClick = () => {
    const { onZoomInClick } = this.props;
    const newScale = Math.round((this.lastScale + 0.5) * 100) / 100;
    if (onZoomInClick) onZoomInClick(newScale);
    this.animateTranslation(newScale, this.lastX, this.lastY);
  };

  onZoomOutClick = () => {
    const { onZoomOutClick } = this.props;
    let newScale = Math.round((this.lastScale - 0.5) * 100) / 100;
    if (newScale < 0.5) newScale = 0.5;
    if (onZoomOutClick) onZoomOutClick(newScale);
    this.animateTranslation(newScale, this.lastX, this.lastY);
  };

  onInfoMount = (id, node) => {
    const regionNode = this.regionsRef.querySelector(`#region-${id}`);
    const rect = node.querySelector('svg').getBoundingClientRect();
    this.infoRefs[id] = { node, regionNode, center: rect.width / 2 };
  };

  onInfoUnmount = (id) => {
    delete this.infoRefs[id];
  };

  onRegionsMount = (f) => {
    this.regionsRef = f;
    this.regionsNode = select(f);
  };

  renderMap = () => {
    const { region } = this.props;
    const { map } = this.state;
    if (!map) return (null);

    return (
      <RegionsWrap id="regions-layer" innerRef={this.onRegionsMount} viewBox="0 0 1000 580">
        {map.children.map((child) => (
          <District
            key={child.id}
            data={child}
            selectedId={region}
            mapId={map.id}
            onClick={this.onRegionClick}
          />
        ))}
      </RegionsWrap>
    );
  };

  renderInfo = () => {
    const { info, onInfoClick } = this.props;
    const { flatMap } = this.state;
    if (!info) return (null);

    return info.map((i) => {
      const region = flatMap[i.region];
      if (!region) return (null);

      return (
        <Info
          key={i.region}
          region={region}
          percents={i.percents}
          onClick={onInfoClick}
          onMount={this.onInfoMount}
          onUnmount={this.onInfoUnmount}
        />
      );
    });
  };

  render() {
    const { theme: globalTheme, favorites, onFlagClick } = this.props;
    const { theme } = this.state;

    return (
      <ThemeProvider theme={getGlobalTheme(globalTheme)}>
        <Wrap {...theme} innerRef={this.wrapRef}>
          <Background />

          {this.renderMap()}

          {this.renderInfo()}

          <Controls
            onZoomInClick={this.onZoomInClick}
            onZoomOutClick={this.onZoomOutClick}
            onFlagClick={onFlagClick}
            favorites={favorites}
          />
        </Wrap>
      </ThemeProvider>
    );
  }
}


export default Map;
