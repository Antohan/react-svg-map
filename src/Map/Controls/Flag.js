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
        <svg width={size} height={size} viewBox="0 0 62 62">
          <g
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onClick}
            filter="url(#filter_flag)"
          >
            <circle
              cx="26"
              cy="26"
              r="26"
              fill={theme.backgroundFill}
              strokeWidth="1"
              transform="translate(4 3)"
            />
            <path fillRule="evenodd" clipRule="evenodd" d="M19 19H33L31 23L33 27H21V33H19V19Z" transform="translate(4 3)" />
            <g transform="translate(44 4)">
              <circle cx="7" cy="7" r="7" fill={theme.counterFill} />
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
          <defs>
            <filter
              id="filter_flag"
              x="0" y="0"
              width="62" height="62"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0"
              />
              <feOffset dx="1" dy="2" />
              <feGaussianBlur stdDeviation="2.5" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
          </defs>
        </svg>
      </g>
    );
  }
}

export default withTheme(Flag);
