import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import get from 'lodash/get';
import { defaultTheme } from '../theme';
import { getThemeAsPlainObjectByKeys, innerMerge } from '../utils';


const Wrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const VerticalLine = styled.div`
  position: absolute;
  width: 1px;
  height: 100%;
  top: 0;
  left: ${props => props.left}%;
  opacity: 0.4;
  background-image: linear-gradient(to bottom, #212c42, #ffffff 49%, #212c42);
`;

const HorizontalLine = styled.div`
  position: absolute;
  width: 100%;
  height: 1px;
  left: 0;
  top: ${props => props.top}%;
  opacity: 0.4;
  background-image: linear-gradient(to right, #212c42, #ffffff 49%, #212c42);
`;


class Background extends PureComponent {
  static displayName = 'Background';

  static propTypes = {
    theme: PropTypes.object,
  };

  static defaultProps = {
    theme: defaultTheme,
  };

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


  renderHorizontalLines = () => {
    const theme = this.currentTheme();
    const deltaY = Math.floor(100 / (theme.horizontalLines + 1));

    return Array(theme.horizontalLines)
      .fill(null)
      .map((_, i) => (<HorizontalLine key={i} top={(i + 1) * deltaY} />));
  };

  renderVerticalLines = () => {
    const theme = this.currentTheme();
    const deltaY = Math.floor(100 / (theme.verticalLines + 1));

    return Array(theme.verticalLines)
      .fill(null)
      .map((_, i) => (<VerticalLine key={i} left={(i + 1) * deltaY} />));
  };

  render() {
    return (
      <Wrap>
        {this.renderHorizontalLines()}
        {this.renderVerticalLines()}
      </Wrap>
    );
  }
}


export default withTheme(Background);
