import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import get from 'lodash/get';

import { innerMerge, getThemeAsPlainObjectByKeys } from '../utils';
import { defaultTheme } from '../theme';

import * as Maps from './Data';
import { Controls } from './Controls';
import { Regions } from './Regions';
import Informations from './Info/Informations';
import Background from './Background';


const Wrap = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: ${props => props.backgroundFill};
`;


class Map extends PureComponent {
  static displayName = 'Map';

  static propTypes = {
    theme: PropTypes.object,
    country: PropTypes.string,
    region: PropTypes.string,
    info: PropTypes.array,
    favorites: PropTypes.number,
    scale: PropTypes.number,
    scaleDelta: PropTypes.number,
    onZoomInClick: PropTypes.func,
    onZoomOutClick: PropTypes.func,
    onFlagClick: PropTypes.func,
    onRegionClick: PropTypes.func,
  };

  static defaultProps = {
    theme: defaultTheme,
    country: 'russia',
    region: 'RF',
    favorites: undefined,
    info: [],
    scale: 1,
    scaleDelta: 0.1,
    onZoomInClick: undefined,
    onZoomOutClick: undefined,
    onFlagClick: undefined,
    onRegionClick: undefined,
  };

  state = {
    scale: this.props.scale,
    lastScale: 1,
    region: this.props.region,
    maximize: this.props.scale === 1,
  };

  wrapRef = React.createRef();

  regionsRef = null;

  regionsInnerRef = null;

  infoRefs = [];

  regionRefs = [];

  theme = null;

  componentDidMount() {
    this.onRegionsUpdate();
    window.addEventListener('resize', this.onRegionsUpdate);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onRegionsUpdate);
  }

  componentDidUpdate() {
    this.onRegionsUpdate();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.region !== state.region) {
      return {
        scale: props.scale,
        lastScale: 1,
        region: props.region,
        maximize: props.scale === 1,
      };
    }
    return null;
  }

  currentTheme = () => {
    if (!this.theme) {
      const { theme } = this.props;

      const merged = innerMerge(
        {},
        get(defaultTheme, 'Map', {}),
        get(theme, 'Map', {}),
      );

      this.theme = getThemeAsPlainObjectByKeys(merged);
    }

    return this.theme;
  };

  onZoomInClick = () => {
    const { onZoomInClick, scaleDelta, } = this.props;
    const { scale, } = this.state;

    const newScale = Math.round((scale + scale * scaleDelta) * 100) / 100;

    if (onZoomInClick) onZoomInClick(newScale);
    this.setState({ scale: newScale, lastScale: scale, }, this.onRegionsUpdate);
  };

  onZoomOutClick = () => {
    const { onZoomOutClick, scaleDelta, } = this.props;
    const { scale, } = this.state;
    if (scale - scaleDelta < scaleDelta) return;

    const newScale = Math.round((scale - scale * scaleDelta) * 100) / 100;

    if (onZoomOutClick) onZoomOutClick(newScale);
    this.setState({ scale: newScale, lastScale: scale, }, this.onRegionsUpdate);
  };

  onFlagClick = () => {
    const { onFlagClick, } = this.props;
    if (onFlagClick) onFlagClick();
    this.onRegionsUpdate();
  };

  onRegionClick = (region) => {
    const { onRegionClick, } = this.props;
    if (onRegionClick) onRegionClick(region);
  };

  onRegionsMount = (regionsRef, regionsInnerRef) => {
    this.regionsRef = regionsRef;
    this.regionsInnerRef = regionsInnerRef;
  };

  onRegionMount = ({ id, ref, }) => {
    this.regionRefs[id] = ref;
  };

  onInfoMount = (info) => {
    this.infoRefs.push(info);
  };

  /**
   * Отцентровка карты в зависимости от видимого региона
   */
  onRegionsUpdate = () => {
    const { scale, lastScale, maximize, } = this.state;

    const regionsElement = this.regionsRef.current;
    const regionsInnerElement = this.regionsInnerRef.current;

    const wrapRect = this.wrapRef.current.getBoundingClientRect();
    const regionsInnerRect = regionsInnerElement.getBoundingClientRect();
    const regionsInnerBBox = regionsInnerElement.getBBox();

    const innerX = -regionsInnerBBox.x;
    const innerY = -regionsInnerBBox.y;
    regionsInnerElement.setAttribute('transform', `translate(${innerX} ${innerY})`);
    regionsElement.setAttribute('height', wrapRect.height - 50);

    const outerX = wrapRect.width / 2 - (regionsInnerRect.width / 2) / lastScale;
    const outerY = (wrapRect.height - 50) / 2 - (regionsInnerRect.height / 2) / lastScale;

    if (!maximize) {
      regionsElement.setAttribute('transform', `scale(${scale})translate(${outerX} ${outerY})`);
      this.setState({ lastScale: scale, }, this.updateRegionStroke);
    } else {
      const maxScaleX = Math.floor(wrapRect.width / regionsInnerRect.width);
      const maxScaleY = Math.floor((wrapRect.height - 50) / regionsInnerRect.height);
      const maxScale = Math.max(Math.min(maxScaleX, maxScaleY), lastScale);

      regionsElement.setAttribute('transform', `scale(${maxScale})translate(${outerX} ${outerY})`);
      this.setState(
        { scale: maxScale, lastScale: maxScale, maximize: false, },
        this.updateRegionStroke
      );
    }

    this.updateInfoPosition();
  };

  updateRegionStroke = () => {
    const { scale, } = this.state;
    const regions = this.regionsRef.current;
    regions.querySelectorAll('path').forEach((p) => {
      p.setAttribute('stroke-width', 1 / scale);
    });
  };

  /**
   * Обновление расположения плашек с информацией.
   * Если указанный регион не видим - скрывает плашку.
   */
  updateInfoPosition = () => {
    const wrapElement = this.wrapRef.current;
    const wrapRect = wrapElement.getBoundingClientRect();

    this.infoRefs.forEach(({ id, ref, }) => {
      const infoNode = ref.current;
      const regionRef = this.regionRefs[id];
      if (!regionRef || !regionRef.current) {
        infoNode.style.display = 'none';
        return;
      }

      infoNode.style.display = '';

      const regionRect = regionRef.current.getBoundingClientRect();
      const x = regionRect.x + regionRect.width / 2;
      const y = regionRect.y + regionRect.height / 2;

      const infoRect = infoNode.getBoundingClientRect();
      const offsetX = wrapRect.x + infoRect.height / 2;
      const offsetY = wrapRect.y + infoRect.height / 2;

      infoNode.style.left = `${Math.round(x - offsetX)}px`;
      infoNode.style.top = `${Math.round(y - offsetY)}px`;
    });
  };

  render() {
    const {
      favorites,
      info,
      country,
      theme,
      region,
    } = this.props;
    const map = Maps[country];
    if (!map) return (null);

    return (
      <ThemeProvider theme={theme}>
        <Wrap {...this.currentTheme()} innerRef={this.wrapRef}>
          <Background />

          <Regions
            data={map}
            currentId={region}
            onRegionClick={this.onRegionClick}
            onMount={this.onRegionsMount}
            onRegionMount={this.onRegionMount}
          />

          <Informations data={info} regions={map} onInfoMount={this.onInfoMount} />
          <Controls
            onZoomInClick={this.onZoomInClick}
            onZoomOutClick={this.onZoomOutClick}
            onFlagClick={this.onFlagClick}
            favorites={favorites}
          />
        </Wrap>
      </ThemeProvider>
    );
  }
}


export default withTheme(Map);
