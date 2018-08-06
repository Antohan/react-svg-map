import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import get from 'lodash/get';
import { innerMerge, getThemeAsPlainObjectByKeys } from '../../utils';
import { defaultTheme } from '../../theme/index';


class ZoomIn extends PureComponent {
  static displayName = 'ZoomIn';

  static propTypes = {
    onClick: PropTypes.func,
    theme: PropTypes.object,
    positionCenter: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    onClick: undefined,
    theme: defaultTheme,
  };

  state = {
    hover: false,
  };

  theme = {};

  currentTheme = () => {
    const { hover } = this.state;
    const current = hover ? 'hover' : 'normal';

    if (!this.theme[current]) {
      const { theme } = this.props;
      const merged = innerMerge(
        {},
        get(defaultTheme, `Map.Controls.ZoomIn.${current}`, {}),
        get(theme, `Map.Controls.ZoomIn.${current}`, {}),
      );

      this.theme[current] = getThemeAsPlainObjectByKeys(merged);
    }

    return this.theme[current];
  };

  onMouseEnter = () => this.setState({ hover: true });

  onMouseLeave = () => this.setState({ hover: false });

  render() {
    const { positionCenter, onClick } = this.props;
    const theme = this.currentTheme();
    const size = theme.radius * 2 + 10;
    const translationX = positionCenter.x - size / 2;
    const translationY = positionCenter.y - size / 2;

    return (
      <g transform={`translate(${translationX} ${translationY})`} onClick={onClick}>
        <svg width={size} height={size} viewBox="0 0 44 44">
          <g
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            transform="translate(1 1)"
          >
            <circle
              cx="21"
              cy="21"
              r="21"
              fill={theme.backgroundFill}
              stroke={theme.signFill}
              strokeWidth="1"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 16 20 H 26 V 22 H 16 Z"
              fill={theme.signFill}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 20 16 V 26 H 22 V 16 Z"
              fill={theme.signFill}
            />
          </g>
        </svg>
      </g>
    );
  }
}

export default withTheme(ZoomIn);
