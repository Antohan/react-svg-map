import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import get from 'lodash/get';
import { defaultTheme, } from '../../theme/index';
import ZoomOut from './ZoomOut';
import ZoomIn from './ZoomIn';
import Flag from './Flag';
import { innerMerge } from '../../utils';


const Wrap = styled.svg`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;


class Controls extends PureComponent {
  static displayName = 'Controls';

  static propTypes = {
    theme: PropTypes.object,
    favorites: PropTypes.number,
    onZoomOutClick: PropTypes.func.isRequired,
    onZoomInClick: PropTypes.func.isRequired,
    onFlagClick: PropTypes.func,
  };

  static defaultProps = {
    theme: defaultTheme,
    onFlagClick: null,
  };

  state = {
    theme: innerMerge(get(defaultTheme, 'Map.Controls'), get(this.props.theme, 'Map.Controls')),
  };

  getSize = () => {
    const { theme } = this.state;

    let height = 0;
    let width = 0;

    Object.keys(theme).forEach((k) => {
      let controlWidth = 0;
      const control = theme[k];
      if (!control.show) return;

      Object.keys(control).forEach((status) => {
        const controlSize = parseInt(control[status].radius, 10) * 2 + 10;
        if (controlSize > height) height = controlSize;
        if (controlSize > controlWidth) controlWidth = controlSize;
      });
      width += controlWidth + 22;
    });

    if (width > 0) width -= 22;

    return { width, height, };
  };


  render() {
    const {
      favorites,
      onZoomOutClick,
      onZoomInClick,
      onFlagClick,
    } = this.props;
    const { theme } = this.state;

    const size = this.getSize();
    const heightCenter = size.height / 2;
    const zoomInPosition = { x: heightCenter, y: heightCenter, };
    const flagPosition = { x: size.width / 2, y: heightCenter, };
    const zoomOutPosition = { x: size.width - heightCenter, y: heightCenter, };

    return (
      <Wrap {...size}>
        <g id="zoom-controls-layer">
          {theme.ZoomOut.show && (
            <ZoomOut onClick={onZoomOutClick} positionCenter={zoomOutPosition} />
          )}
          {theme.Flag.show && (
            <Flag
              onClick={onFlagClick}
              positionCenter={flagPosition}
              favorites={favorites}
            />
          )}
          {theme.ZoomIn.show && (
            <ZoomIn onClick={onZoomInClick} positionCenter={zoomInPosition} />
          )}
        </g>
      </Wrap>
    );
  }
}

export default withTheme(Controls);
