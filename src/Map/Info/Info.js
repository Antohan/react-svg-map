import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import get from 'lodash/get';
import { innerMerge, getThemeAsPlainObjectByKeys } from '../../utils';
import { defaultTheme } from '../../theme/index';


const Wrap = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
`;

const TextWrap = styled.div`
  margin-left: 10px;
  cursor: default;
  color: ${props => props.color};
  fontSize: ${props => props.fontSize};
`;


class Info extends PureComponent {
  static displayName = 'Info';

  static propTypes = {
    theme: PropTypes.object,
    region: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    percent: PropTypes.number.isRequired,
    onMount: PropTypes.func,
  };

  static defaultProps = {
    theme: defaultTheme,
    onMount: undefined,
  };

  state = {
    hover: false,
  };

  wrapRef = React.createRef();

  theme = {};

  componentDidMount() {
    const { onMount, region } = this.props;
    if (onMount) onMount({ id: region, ref: this.wrapRef });
  }

  currentTheme = () => {
    const { hover } = this.state;
    let current = 'normal';
    if (hover) current = 'hover';

    if (!this.theme[current]) {
      const { theme } = this.props;

      const merged = innerMerge(
        {},
        get(defaultTheme, `Map.Info.${current}`, {}),
        get(theme, `Map.Info.${current}`, {}),
      );

      this.theme[current] = getThemeAsPlainObjectByKeys(merged);
    }

    return this.theme[current];
  };

  onMouseEnter = () => this.setState({ hover: true });

  onMouseLeave = () => this.setState({ hover: false });

  get backgroundFill() {
    const { percent } = this.props;
    const theme = this.currentTheme();

    if (percent <= 33) return theme.backgroundFillLow;
    if (percent <= 66) return theme.backgroundFillMedium;
    return theme.backgroundFillHigh;
  }

  render() {
    const { percent, title, region } = this.props;
    const theme = this.currentTheme();
    const size = theme.radius * 2;

    return (
      <Wrap data-region={region} innerRef={this.wrapRef}>
        <svg width={size} height={size} viewBox="0 0 41 41" fill="none">
          <g onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <circle cx="20.5" cy="20.5" r="15.5" fill={this.backgroundFill} />
            <circle cx="20.5" cy="20.5" r="18" stroke="#B8B8B8" strokeOpacity="0.39" strokeWidth="5" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              alignmentBaseline="central"
              fill={theme.percentColor}
              fontSize={theme.percentSize}
              style={{ cursor: 'default' }}
            >
              {percent}%
            </text>
          </g>
        </svg>
        <TextWrap
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          color={theme.titleColor}
          fontSize={theme.titleSize}
        >
          {title}
        </TextWrap>
      </Wrap>
    );
  }
}


export default withTheme(Info);
