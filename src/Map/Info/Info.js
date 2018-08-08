import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import get from 'lodash/get';
import { innerMerge, getThemeAsPlainObjectByKeys, fireEvent } from '../../utils';
import { defaultTheme } from '../../theme/index';


const Wrap = styled.div`
  display: block;
  align-items: center;
  position: absolute;
  height: 0;
  top: 0;
  left: 0;
`;

const TextWrap = styled.div`
  margin-left: ${props => props.marginLeft}px;
  cursor: default;
  white-space: nowrap;
  position: absolute;
  top: 50%;
  transform: translateY(-55%);
  color: ${props => props.color};
  fontSize: ${props => props.fontSize};
`;

const SvgWrap = styled.svg`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;


class Info extends PureComponent {
  static displayName = 'Info';

  static propTypes = {
    theme: PropTypes.object,
    region: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    percent: PropTypes.number.isRequired,
    onMount: PropTypes.func,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    theme: defaultTheme,
    onMount: null,
    onClick: null,
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

  onMouseEnter = () => fireEvent(`region-${this.props.region}`, 'mouseover');

  onMouseLeave = () => fireEvent(`region-${this.props.region}`, 'mouseout');

  onInnerMouseEnter = () => this.setState({ hover: true });

  onInnerMouseLeave = () => this.setState({ hover: false });

  onClick = () => {
    const { onClick, region } = this.props;
    if (onClick) onClick({ id: region });
    else fireEvent(`region-${region}`, 'click');
  };

  get backgroundFill() {
    const { percent } = this.props;
    const theme = this.currentTheme();

    if (percent <= 33) return theme.backgroundFillLow;
    if (percent <= 66) return theme.backgroundFillMedium;
    return theme.backgroundFillHigh;
  }

  render() {
    const { percent, title } = this.props;
    const theme = this.currentTheme();
    const size = theme.radius * 2;

    return (
      <Wrap
        innerRef={this.wrapRef}
      >
        <SvgWrap
          width={size}
          height={size}
          viewBox="0 0 41 41"
          fill="none"
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}
        >
          <g onMouseEnter={this.onInnerMouseEnter} onMouseLeave={this.onInnerMouseLeave}>
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
        </SvgWrap>
        <TextWrap
          color={theme.titleColor}
          fontSize={theme.titleSize}
          marginLeft={size + 10}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}
        >
          {title}
        </TextWrap>
      </Wrap>
    );
  }
}


export default withTheme(Info);
