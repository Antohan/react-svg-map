import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import get from 'lodash/get';
import { innerMerge, getThemeAsPlainObjectByKeys } from '../../utils';
import { defaultTheme } from '../../theme/index';


class ZoomOut extends PureComponent {
  static displayName = 'ZoomOut';

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
        get(defaultTheme, `Map.Controls.ZoomOut.${current}`, {}),
        get(theme, `Map.Controls.ZoomOut.${current}`, {}),
      );

      this.theme[current] = getThemeAsPlainObjectByKeys(merged);
    }

    return this.theme[current];
  };

  onMouseEnter = () => this.setState({ hover: true });

  onMouseLeave = () => this.setState({ hover: false });

  onClick = (e) => {
    const { onClick } = this.props;
    if (onClick) onClick(e);
  };

  render() {
    const { positionCenter } = this.props;
    const theme = this.currentTheme();
    const size = theme.radius * 2 + 10;
    const translateX = positionCenter.x - size / 2;
    const translateY = positionCenter.y - size / 2;

    return (
      <g transform={`translate(${translateX} ${translateY})`}>
        <svg width={size} height={size} viewBox="0 0 44 44">
          <g
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onClick}
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
              d="M 17 20 H 25 V 22 H 17 Z"
              fill={theme.signFill}
            />
          </g>
        </svg>
      </g>
    );
  }
}

export default withTheme(ZoomOut);
