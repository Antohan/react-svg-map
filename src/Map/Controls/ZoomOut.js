import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { withTheme, } from 'styled-components';
import get from 'lodash/get';
import {innerMerge, getThemeAsPlainObjectByKeys, getTheme,} from '../../utils';
import { defaultTheme, } from '../../theme/index';


class ZoomOut extends PureComponent {
  static displayName = 'ZoomOut';

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    theme: PropTypes.object,
    positionCenter: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    theme: defaultTheme,
  };

  state = {
    hover: false,
  };

  theme = {};

  currentTheme = () => {
    const { theme } = this.props;
    const { hover, } = this.state;
    const current = hover ? 'hover' : 'normal';

    if (!this.theme[current]) this.theme[current] = getTheme(theme, `Map.Controls.ZoomOut.${current}`);

    return this.theme[current];
  };

  onMouseEnter = () => this.setState({ hover: true, });

  onMouseLeave = () => this.setState({ hover: false, });

  onClick = () => this.props.onClick();

  render() {
    const { positionCenter, } = this.props;
    const theme = this.currentTheme();
    const size = theme.radius * 2 + 10;
    const translateX = positionCenter.x - size / 2;
    const translateY = positionCenter.y - size / 2;

    return (
      <g transform={`translate(${translateX - 2} ${translateY})`}>
        <svg width={size} height={size} viewBox="0 0 50 50">
          <g
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onClick}
            transform="translate(1 1)"
            filter="url(#filter_zoomout)"
          >
            <circle
              cx="20"
              cy="20"
              r="20"
              fill={theme.backgroundFill}
              strokeWidth="1"
              transform="translate(4 3)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 15 19 H 25 V 21 H 15 Z"
              fill={theme.signFill}
              transform="translate(4 3)"
            />
          </g>
          <defs>
            <filter
              id="filter_zoomout"
              x="0"
              y="0"
              width="50"
              height="50"
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

export default withTheme(ZoomOut);
