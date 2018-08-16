import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, } from 'styled-components';
import times from 'lodash/times';
import { defaultTheme, } from '../theme';
import { getGlobalTheme, getTheme, } from '../utils';


const Wrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Line = styled.div`
  position: absolute;
  width: ${props => props.left ? '1px' : '100%'};
  height: ${props => props.top ? '1px' : '100%'};
  top: ${props => props.top || 0}%;
  left: ${props => props.left || 0}%;
  opacity: 0.4;
  background-color: ${props => props.bgColor};
`;


class Background extends PureComponent {
  static displayName = 'Background';

  static propTypes = {
    theme: PropTypes.object,
  };

  static defaultProps = {
    theme: defaultTheme,
  };

  state = {
    theme: getTheme(this.props.theme, 'Map'),
  };

  renderHorizontalLines = () => {
    const { theme, } = this.state;
    const deltaY = Math.floor(100 / (theme.horizontalLines + 1));

    return times(theme.horizontalLines, i => (
      <Line key={i} top={(i + 1) * deltaY} bgColor={theme.backgroundLineColor} />
    ));
  };

  renderVerticalLines = () => {
    const { theme, } = this.state;
    const deltaY = Math.floor(100 / (theme.verticalLines + 1));

    return times(theme.verticalLines, i => (
      <Line key={i} left={(i + 1) * deltaY} bgColor={theme.backgroundLineColor} />
    ));
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
