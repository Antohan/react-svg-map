import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import get from 'lodash/get';
import { innerMerge, getThemeAsPlainObjectByKeys } from '../../utils';
import { defaultTheme } from '../../theme/index';


class Flag extends PureComponent {
  static displayName = 'Flag';

  static propTypes = {
    onClick: PropTypes.func,
    theme: PropTypes.object,
    positionCenter: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
    favorites: PropTypes.number,
  };

  static defaultProps = {
    onClick: undefined,
    favorites: undefined,
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
        get(defaultTheme, `Map.Controls.Flag.${current}`, {}),
        get(theme, `Map.Controls.Flag.${current}`, {}),
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
    const { positionCenter, favorites } = this.props;
    const theme = this.currentTheme();
    const size = theme.radius * 2 + 10;

    return (
      <g transform={`translate(${positionCenter.x - size / 2} ${positionCenter.y - size / 2})`}>
        <svg width={size} height={size} viewBox="0 0 44 44">
          <g
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onClick}
          >
            <circle
              cx="22"
              cy="22"
              r="21"
              fill={theme.backgroundFill}
              stroke={theme.signFill}
              strokeWidth="1"
            />
            <path fillRule="evenodd" clipRule="evenodd" d="M16 14H30L28 19L30 24H18V31H16V16Z" />
            <g transform="translate(26 0)">
              <circle cx="8" cy="8" r="8" fill={theme.counterFill} />
              {favorites && (
                <text
                  x="5"
                  y="11"
                  stroke={theme.counterColor}
                  strokeWidth="1px"
                  fontSize="11"
                >
                  {favorites}
                </text>
              )}
            </g>
          </g>
        </svg>
      </g>
    );
  }
}

export default withTheme(Flag);
