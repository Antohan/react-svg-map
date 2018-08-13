import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import styled, {withTheme} from 'styled-components';
import { defaultTheme, } from '../../theme/index';
import ZoomOut from './ZoomOut';
import ZoomIn from './ZoomIn';
import Flag from './Flag';
import {getTheme} from "../../utils";


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
    onFlagClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    theme: defaultTheme,
  };

  getSize = () => {
    const { theme } = this.props;
    const allCtrls = theme.Map.Controls;

    let height = 0;
    let width = 0;

    Object.keys(allCtrls).forEach((k) => {
      let controlWidth = 0;
      const control = allCtrls[k];

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

    const size = this.getSize();
    const heightCenter = size.height / 2;
    const zoomInPosition = { x: heightCenter, y: heightCenter, };
    const flagPosition = { x: size.width / 2, y: heightCenter, };
    const zoomOutPosition = { x: size.width - heightCenter, y: heightCenter, };

    return (
      <Wrap {...size}>
        <g id="zoom-controls-layer">
          <ZoomOut onClick={onZoomOutClick} positionCenter={zoomOutPosition} />
          <Flag
            onClick={onFlagClick}
            positionCenter={flagPosition}
            favorites={favorites}
          />
          <ZoomIn onClick={onZoomInClick} positionCenter={zoomInPosition} />
        </g>
      </Wrap>
    );
  }
}

export default withTheme(Controls);
