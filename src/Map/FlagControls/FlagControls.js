import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { defaultTheme } from '../../theme/index';
import Flag from './Flag';


const Wrap = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
`;


export default class Controls extends PureComponent {
  static displayName = 'Controls';

  static propTypes = {
    theme: PropTypes.object,
    onFlagClick: PropTypes.func,
    favorites: PropTypes.number,
  };

  static defaultProps = {
    theme: defaultTheme,
    favorites: undefined,
    onFlagClick: undefined,
  };

  getSize = () => {
    const { theme } = this.props;
    const allCtrls = theme.Map.Controls;
    const flagCtrl = allCtrls.Flag;

    let height = 0;
    let width = 0;

    Object.keys(flagCtrl).forEach((status) => {
      const controlSize = parseInt(flagCtrl[status].radius, 10) * 2 + 10;
      if (controlSize > width) width = controlSize;
      if (controlSize > height) height = controlSize;
    });

    return { width, height };
  };


  render() {
    const {
      theme,
      onFlagClick,
      favorites,
    } = this.props;

    const size = this.getSize();
    const heightCenter = size.height / 2;
    const flagPosition = { x: size.width / 2, y: heightCenter };

    return (
      <Wrap {...size}>
        <g id="flag-controls-layer">
          <Flag
            theme={theme}
            onClick={onFlagClick}
            positionCenter={flagPosition}
            favorites={favorites}
          />
        </g>
      </Wrap>
    );
  }
}
