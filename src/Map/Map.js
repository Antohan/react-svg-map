import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { select, drag, zoom, event as d3event, } from 'd3';
import styled, { withTheme, ThemeProvider, } from 'styled-components';
import isEqual from 'lodash/isEqual';
import throttle from 'lodash/throttle';
import { getScale, getPosition, getTheme, getGlobalTheme, getFlatMap, } from '../utils';
import { defaultTheme, } from '../theme';

import * as Maps from './Data';
import { Controls, } from './Controls';
import Background from './Background';
import District from './Regions/District';
import Info from './Info';


const OuterWrap = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: ${props => props.backgroundFill};  
  overflow: hidden;
`;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const RegionsLayer = styled.svg`
  position: relative;
`;

const RegionsWrap = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
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
    visibleInfo: PropTypes.string,
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
    visibleInfo: null,
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
    hideInfo: false,
  };

  wrapRef = React.createRef();

  regionsLayerRef = React.createRef();

  regionsWrapRef = React.createRef();

  infoRefs = {};

  lastScale = 1;

  lastX = 0;

  lastY = 0;

  componentDidMount() {
    const { region, } = this.props;
    const { map, } = this.state;
    const [width, height] = map.size;
    const rect = this.regionsWrapRef.current.getBoundingClientRect();

    const scale = Math.min(rect.width / width, rect.height / height);

    this.regionsLayerRef.current.setAttribute('width', Math.floor(width * scale));
    this.regionsLayerRef.current.setAttribute('height', Math.floor(height * scale));
    this.regionsLayerRef.current.style.marginLeft = `${(rect.width - width * scale) / 2}px`;

    if (region) this.zoomToSelectedId(region);
    else this.animateInfoTranslation();
    const mapZoomer = zoom().on('zoom', this.onZoom);
    const wrapDragger = drag().subject(this.wrapRef.current)
      .on('drag', this.onDrag);
    select(this.wrapRef.current).call(wrapDragger).call(mapZoomer);
  }

  componentDidUpdate(prevProps) {
    const { region, info, } = this.props;
    if (region !== prevProps.region || !isEqual(info, prevProps.info)) {
      this.zoomToSelectedId(region);
    }
  }

  animateTranslation = (scale, x, y, duration = 1000) => {
    const { width, height } = getComputedStyle(this.wrapRef.current);
    const left = -parseInt(width, 10) / 2;
    const top = -parseInt(height, 10) / 2;

    select(this.wrapRef.current)
      .transition()
      .duration(duration)
      .style('transform', `translate(${left}px, ${top}px)scale(1)`);
    select(this.regionsLayerRef.current)
      .transition()
      .duration(duration)
      .attr('transform', `scale(${scale})translate(${x} ${y})`)
      .attr('stroke-width', 1 / scale)
      .on('start', () => this.setState({ hideInfo: true, }))
      .on('end', this.animateInfoTranslation);
    this.lastScale = scale;
    this.lastX = x;
    this.lastY = y;
  };

  animateInfoTranslation = () => {
    const { map, flatMap, } = this.state;
    const wrapRect = this.regionsWrapRef.current.getBoundingClientRect();
    const rect = this.regionsLayerRef.current.getBoundingClientRect();
    const matrix = this.regionsLayerRef.current.getScreenCTM();

    this.setState(
      { hideInfo: false, },
      () => {
        Object.keys(this.infoRefs).forEach((key) => {
          const { node, center, } = this.infoRefs[key];
          let region = flatMap[key];
          if (!region) region = map;

          node.style.left = `${rect.x - wrapRect.x + (region.center[0]) * matrix.a - center}px`;
          node.style.top = `${rect.y - wrapRect.y + (region.center[1]) * matrix.a}px`;
        });
      }
    );
  };

  zoomToSelectedId = (id) => {
    const { map, flatMap, } = this.state;
    let region = flatMap[id];
    if (!region) region = map;

    const wrapStyle = getComputedStyle(this.wrapRef.current);
    const width = parseInt(wrapStyle.width, 10);
    const height = parseInt(wrapStyle.height, 10);
    const scale = getScale(map.size, region.size);

    const regionNode = this.wrapRef.current.querySelector(`#region-${region.id}`);
    if (!regionNode) return;
    const parent = regionNode.parentNode;
    parent.removeChild(regionNode);
    parent.appendChild(regionNode);

    this.animateTranslation(scale, ...getPosition(map.center, region.center, { width, height }));
  };

  onRegionClick = (region) => {
    const { onRegionClick, } = this.props;
    let update = true;
    if (onRegionClick) {
      update = onRegionClick(region);
    }
    if (update) this.zoomToSelectedId(region.id);
  };

  onZoomInClick = () => {
    const { onZoomInClick, } = this.props;
    const newScale = Math.round((this.lastScale + this.lastScale * 0.25) * 100) / 100;
    if (onZoomInClick) onZoomInClick(newScale);
    this.animateTranslation(newScale, this.lastX, this.lastY);
  };

  onZoomOutClick = () => {
    const { onZoomOutClick, } = this.props;
    let newScale = Math.round((this.lastScale - this.lastScale * 0.33) * 100) / 100;
    if (newScale < 0.5) newScale = 0.5;
    if (onZoomOutClick) onZoomOutClick(newScale);
    this.animateTranslation(newScale, this.lastX, this.lastY);
  };

  onInfoMount = (id, node) => {
    const rect = node.querySelector('svg').getBoundingClientRect();
    this.infoRefs[id] = { node, center: rect.width / 2, };
  };

  onInfoUnmount = (id) => {
    delete this.infoRefs[id];
  };

  onDrag = () => {
    const { subject, } = d3event;
    const { transform, width, height, } = getComputedStyle(subject);
    const match = transform.match(/matrix\((-?[\d.]+), -?\d+, -?\d+, (-?[\d.]+), (-?[\d.]+), (-?[\d.]+)\)/);
    if (match) {
      const left = parseInt(match[3], 10) + d3event.dx;
      const top = parseInt(match[4], 10) + d3event.dy;
      subject.style.transform = `translate(${left}px, ${top}px)scale(${match[1]})`;
    } else {
      const left = -parseInt(width, 10) / 2;
      const top = -parseInt(height, 10) / 2;
      subject.style.transform = `translate(${left}px, ${top}px)`;
    }
  };

  onZoom = () => {
    const { deltaY, } = d3event.sourceEvent;

    const { transform, } = getComputedStyle(this.wrapRef.current);
    const match = transform.match(/matrix\((-?[\d.]+), -?\d+, -?\d+, (-?[\d.]+), (-?[\d.]+), (-?[\d.]+)\)/);
    if (match) {
      const scale = parseFloat(match[1]);
      const newScale = Math.round(
        (deltaY > 0 ? scale - scale * 0.033 : scale + scale * 0.025) * 100
      ) / 100;
      const left = parseInt(match[3], 10);
      const top = parseInt(match[4], 10);
      this.wrapRef.current.style.transform = `translate(${left}px, ${top}px)scale(${newScale})`;
    }
  };

  renderMap = () => {
    const { region, } = this.props;
    const { map, } = this.state;
    if (!map) return (null);
    const { size: [width, height, ], } = map;

    return (
      <RegionsWrap innerRef={this.regionsWrapRef}>
        <RegionsLayer id={`region-${map.id}`} innerRef={this.regionsLayerRef} viewBox={`0 0 ${width} ${height}`}>
          {map.children.map(child => (
            <District
              key={child.id}
              data={child}
              selectedId={region}
              mapId={map.id}
              onClick={this.onRegionClick}
            />
          ))}
        </RegionsLayer>
        {this.renderInfo()}
      </RegionsWrap>
    );
  };

  renderInfo = () => {
    const { info, onInfoClick, region, visibleInfo, } = this.props;
    const { flatMap, hideInfo, map, } = this.state;
    if (!info) return (null);

    return info.map((i) => {
      const data = flatMap[i.region];
      if (!data) return (null);
      const hidden = hideInfo
        || (visibleInfo !== i.region && (i.owner !== map.id || region === i.region));

      return (
        <Info
          key={i.region}
          region={data}
          percents={i.percents}
          onClick={onInfoClick}
          hidden={hidden}
          onMount={this.onInfoMount}
          onUnmount={this.onInfoUnmount}
        />
      );
    });
  };

  render() {
    const { theme: globalTheme, favorites, onFlagClick, } = this.props;
    const { theme, } = this.state;

    return (
      <ThemeProvider theme={getGlobalTheme(globalTheme)}>
        <OuterWrap {...theme}>
          <Background />

          <Wrap innerRef={this.wrapRef}>

            {this.renderMap()}

          </Wrap>

          <Controls
            onZoomInClick={this.onZoomInClick}
            onZoomOutClick={this.onZoomOutClick}
            onFlagClick={onFlagClick}
            favorites={favorites}
          />
        </OuterWrap>
      </ThemeProvider>
    );
  }
}


export default Map;
