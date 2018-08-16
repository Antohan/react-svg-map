import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, } from 'styled-components';
import isEqual from 'lodash/isEqual';
import { fireEvent, getTheme, } from '../utils';
import { defaultTheme, } from '../theme/index';


const Wrap = styled.div`
  display: block;
  align-items: center;
  position: absolute;
  height: 0;
  top: -100px;
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
  pointer-events: none;
`;

const SvgWrap = styled.svg`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  filter: drop-shadow( 2px 2px 1px rgba(0,0,0,.7) );
  pointer-events: none;
`;


class Info extends PureComponent {
  static displayName = 'Info';

  static propTypes = {
    theme: PropTypes.object,
    region: PropTypes.object.isRequired,
    percents: PropTypes.arrayOf(PropTypes.number).isRequired,
    onMount: PropTypes.func.isRequired,
    onUnmount: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    hidden: PropTypes.bool,
  };

  static defaultProps = {
    theme: defaultTheme,
    hidden: false,
    onClick: null,
  };

  state = {
    hover: false,
    hidden: false,
  };

  wrapRef = React.createRef();

  theme = {};

  static getDerivedStateFromProps(nextProps, oldState) {
    if (nextProps.hidden !== oldState.hidden) {
      if (oldState.hover) return { hidden: false, };
      return { hidden: nextProps.hidden, };
    }
    return null;
  }

  componentDidMount() {
    const { region, onMount, } = this.props;
    onMount(region.id, this.wrapRef.current);
    this.updatePercents();
  }

  componentWillUnmount() {
    const { region, onUnmount, } = this.props;
    onUnmount(region.id);
  }

  componentDidUpdate(oldProps) {
    const { region, percents, } = this.props;
    if (!isEqual(region.id, oldProps.region.id) || !isEqual(percents, oldProps.percents)) {
      this.updatePercents();
    }
  }

  currentTheme = () => {
    const { theme, } = this.props;
    const { hover, } = this.state;
    let current = 'normal';
    if (hover) current = 'hover';

    if (!this.theme[current]) this.theme[current] = getTheme(theme, `Map.Info.${current}`);
    return this.theme[current];
  };

  updatePercents = () => {
    const { percents, } = this.props;

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

  onMouseEnter = () => this.setState({ hover: true, });

  onMouseLeave = () => this.setState({ hover: false, });

  onClick = () => {
    const { onClick, region: { id, }, } = this.props;
    if (onClick) onClick({ id, });
    else fireEvent(`region-${id}`, 'click');
  };

  backgroundFill = (percent, index) => {
    const theme = this.currentTheme();

    if (theme.usePercentColor) {
      if (percent <= 33) return theme.backgroundFillLow;
      if (percent <= 66) return theme.backgroundFillMedium;
      return theme.backgroundFillHigh;
    }

    return theme[`backgroundFill${index}`];
  };

  renderPercents = () => {
    const { percents, } = this.props;

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
            stroke={this.backgroundFill(percent, i)}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ transition: 'stroke-dashoffset 0.4s linear', }}
          />
        </React.Fragment>
      );
    });
  };

  render() {
    const { region, } = this.props;
    const { hover, hidden } = this.state;
    const theme = this.currentTheme();
    const size = theme.radius * 2;

    const visible = !hidden || hover;

    return (
      <Wrap
        id={`info-${region.id}`}
        innerRef={this.wrapRef}
        {...!visible && { style: { display: 'none', }, }}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <SvgWrap
          width={size}
          height={size}
          viewBox="0 0 41 41"
          fill="none"
          onClick={this.onClick}
        >
          <g transform="rotate(-90)translate(-41 0)">
            {this.renderPercents()}
          </g>
        </SvgWrap>
        <TextWrap
          color={theme.titleColor}
          fontSize={theme.titleSize}
          marginLeft={size + 10}
          onClick={this.onClick}
        >
          {region.title}
        </TextWrap>
      </Wrap>
    );
  }
}


export default withTheme(Info);
