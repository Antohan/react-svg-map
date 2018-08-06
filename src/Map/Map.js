import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, ThemeProvider } from 'styled-components';
import get from 'lodash/get';

import { innerMerge, getThemeAsPlainObjectByKeys } from '../utils';
import { defaultTheme } from '../theme/index';

import * as Maps from './Data/index';
import { ZoomControls } from './ZoomControls/index';
import { FlagControls } from './FlagControls/index';
import { Regions } from './Regions/index';
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
  };

  wrapRef = React.createRef();

  regionsRef = null;

  regionsInnerRef = null;

  infoRefs = [];

  regionRefs = [];

  theme = null;

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
    const { onZoomInClick, scaleDelta } = this.props;
    const { scale } = this.state;

    const newScale = scale + scaleDelta;

    if (onZoomInClick) onZoomInClick(newScale);
    this.setState({ scale: newScale, lastScale: scale }, this.onRegionsUpdate);
  };

  onZoomOutClick = () => {
    const { onZoomOutClick, scaleDelta } = this.props;
    const { scale } = this.state;
    if (scale - scaleDelta < scaleDelta) return;

    const newScale = scale - scaleDelta;

    if (onZoomOutClick) onZoomOutClick(newScale);
    this.setState({ scale: newScale, lastScale: scale }, this.onRegionsUpdate);
  };

  onFlagClick = () => {
    const { onFlagClick } = this.props;
    if (onFlagClick) onFlagClick();
    this.onRegionsUpdate();
  };

  onRegionClick = (region) => {
    const { onRegionClick } = this.props;
    if (onRegionClick) onRegionClick(region);
    this.setState({ region: region.id }, () => this.onRegionsUpdate(true));
  };

  componentDidMount() {
    this.onRegionsUpdate(true);
    window.addEventListener('resize', this.onRegionsUpdate);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onRegionsUpdate);
  }

  componentDidUpdate() {
    this.onRegionsUpdate();
  }

  onRegionsMount = (regionsRef, regionsInnerRef) => {
    this.regionsRef = regionsRef;
    this.regionsInnerRef = regionsInnerRef;
  };

  onRegionMount = ({ id, ref }) => {
    this.regionRefs[id] = ref;
  };

  onInfoMount = (info) => {
    this.infoRefs.push(info);
  };

  /**
   * Отцентровка карты в зависимости от видимого региона
   */
  onRegionsUpdate = (maximize = false) => {
    const { scale, lastScale } = this.state;

    const regionsElement = this.regionsRef.current;
    const regionsInnerElement = this.regionsInnerRef.current;

    const wrapRect = this.wrapRef.current.getBoundingClientRect();
    const regionsInnerRect = regionsInnerElement.getBoundingClientRect();
    const regionsInnerBBox = regionsInnerElement.getBBox();

    const innerX = -regionsInnerBBox.x;
    const innerY = -regionsInnerBBox.y;
    regionsInnerElement.setAttribute('transform', `translate(${innerX} ${innerY})`);

    if (!maximize) {
      const outerX = wrapRect.width / 2 - (regionsInnerRect.width / 2) / lastScale;
      const outerY = wrapRect.height / 2 - (regionsInnerRect.height / 2) / lastScale;

      regionsElement.setAttribute('transform', `scale(${scale})translate(${outerX} ${outerY})`);
      this.setState({ lastScale: scale }, this.updateRegionStroke);
    } else {
      const maxScaleX = Math.floor(wrapRect.width / regionsInnerRect.width);
      const maxScaleY = Math.floor(wrapRect.height / regionsInnerRect.height);
      const maxScale = Math.max(Math.min(maxScaleX, maxScaleY), lastScale);
      const outerX = (wrapRect.width / 2 - (regionsInnerRect.width / 2) / lastScale);
      const outerY = (wrapRect.height / 2 - (regionsInnerRect.height / 2) / lastScale);

      regionsElement.setAttribute('transform', `scale(${maxScale})translate(${outerX} ${outerY})`);
      this.setState({ scale: maxScale, lastScale: maxScale }, this.updateRegionStroke);
    }

    this.updateInfoPosition();
  };

  updateRegionStroke = () => {
    const { scale } = this.state;
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

    this.infoRefs.forEach(({ id, ref }) => {
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
    const { favorites, info, country, theme } = this.props;
    const { region } = this.state;
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
          <ZoomControls onZoomInClick={this.onZoomInClick} onZoomOutClick={this.onZoomOutClick} />
          <FlagControls onFlagClick={this.onFlagClick} favorites={favorites} />
        </Wrap>
      </ThemeProvider>
    );
  }
}


export default withTheme(Map);
