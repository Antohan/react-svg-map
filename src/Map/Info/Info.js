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
    percents: PropTypes.arrayOf(PropTypes.number),
    onMount: PropTypes.func.isRequired,
    onUnmount: PropTypes.func.isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    theme: defaultTheme,
    percents: [],
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
    this.updatePercents();
  }

  componentWillUnmount() {
    const { onUnmount, region } = this.props;
    if (onUnmount) onUnmount(region);
  }

  componentDidUpdate() {
    this.updatePercents();
  }

  updatePercents = () => {
    const { percents } = this.props;

    if (!percents.length) return;

    percents.forEach((percent, i) => {
      const circle = this.wrapRef.current.querySelector(`.effect-${i}`);
      if (!circle) return;
      const radius = 4 + 4 * i;
      const circumference = Math.round((Math.PI * (radius * 2) + 0.00001) * 100) / 100;
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference;

      setTimeout(() => {
        circle.style.strokeDashoffset = circumference / 100 * (100 - percent);
      }, 100);
    });
  };

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

  backgroundFill = (percent) => {
    const theme = this.currentTheme();

    if (percent <= 33) return theme.backgroundFillLow;
    if (percent <= 66) return theme.backgroundFillMedium;
    return theme.backgroundFillHigh;
  };

  renderPercents = () => {
    const { percents } = this.props;

    if (!percents.length) {
      return (
        <circle
          cx="20.5"
          cy="20.5"
          r="10"
          strokeWidth="3"
          fill="transparent"
          stroke="#B8B8B8"
          strokeOpacity="0.39"
        />
      );
    }

    return percents.map((percent, i) => {
      const radius = 4 + 4 * i;
      const circumference = Math.round((Math.PI * (radius * 2) + 0.00001) * 100) / 100;

      return (
        <React.Fragment key={`percent-${percent}-${i}`}>
          <circle
            cx="20.5"
            cy="20.5"
            r={radius}
            strokeWidth="3"
            fill="transparent"
            stroke="#B8B8B8"
            strokeOpacity="0.39"
          />
          <circle
            className={`effect-${i}`}
            cx="20.5"
            cy="20.5"
            r={radius}
            strokeWidth="3"
            fill="transparent"
            stroke={this.backgroundFill(percent)}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ transition: 'stroke-dashoffset 0.4s linear' }}
          />
        </React.Fragment>
      );
    });
  };

  render() {
    const { title } = this.props;
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
          <g
            onMouseEnter={this.onInnerMouseEnter}
            onMouseLeave={this.onInnerMouseLeave}
            transform="rotate(-90)translate(-41 0)"
          >
            {this.renderPercents()}
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
