import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { defaultTheme } from '../../theme/index';
import ZoomOut from './ZoomOut';
import ZoomIn from './ZoomIn';


const Wrap = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
`;


export default class Controls extends PureComponent {
  static displayName = 'Controls';

  static propTypes = {
    theme: PropTypes.object,
    onZoomOutClick: PropTypes.func,
    onZoomInClick: PropTypes.func,
  };

  static defaultProps = {
    theme: defaultTheme,
    onZoomOutClick: undefined,
    onZoomInClick: undefined,
  };

  getSize = () => {
    const { theme } = this.props;
    const allCtrls = theme.Map.Controls;

    let height = 0;
    let width = 0;

    const ctrls = [allCtrls.ZoomIn, allCtrls.ZoomOut];

    ctrls.forEach((ctrl) => {
      let controlsHeight = 0;

      Object.keys(ctrl).forEach((status) => {
        const controlSize = parseInt(ctrl[status].radius, 10) * 2 + 10;
        if (controlSize > width) width = controlSize;
        if (controlSize > controlsHeight) controlsHeight = controlSize;
      });
      height += controlsHeight + 10;
    });

    if (height > 0) height -= 10;

    return { width, height };
  };


  render() {
    const {
      theme,
      onZoomOutClick,
      onZoomInClick,
    } = this.props;

    const size = this.getSize();
    const widthCenter = size.width / 2;
    const zoomInPosition = { x: widthCenter, y: widthCenter };
    const zoomOutPosition = { x: widthCenter, y: size.height - widthCenter };

    return (
      <Wrap {...size}>
        <g id="zoom-controls-layer">
          <ZoomOut theme={theme} onClick={onZoomOutClick} positionCenter={zoomOutPosition} />
          <ZoomIn theme={theme} onClick={onZoomInClick} positionCenter={zoomInPosition} />
        </g>
      </Wrap>
    );
  }
}
