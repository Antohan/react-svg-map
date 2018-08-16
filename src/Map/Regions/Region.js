import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { withTheme, } from 'styled-components';
import {fireEvent, getTheme,} from '../../utils';
import { defaultTheme, } from '../../theme/index';


class Region extends PureComponent {
  static displayName = 'Region';

  static propTypes = {
    theme: PropTypes.object,
    onClick: PropTypes.func,
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      size: PropTypes.arrayOf(PropTypes.number),
      center: PropTypes.arrayOf(PropTypes.number),
    }),
    active: PropTypes.bool,
    inactive: PropTypes.bool,
    hovered: PropTypes.bool,
  };

  static defaultProps = {
    theme: defaultTheme,
    onClick: undefined,
    active: false,
    inactive: false,
    hovered: false,
  };

  state = {
    hover: false,
  };

  wrapRef = React.createRef();

  theme = {};

  currentTheme = () => {
    const { active, theme, inactive, hovered } = this.props;
    const { hover, } = this.state;
    let current = 'normal';
    if (active || hovered) current = 'active';
    else if (inactive) current = 'inactive';
    if (hover) current = 'hover';

    if (!this.theme[current]) this.theme[current] = getTheme(theme, `Map.Region.${current}`);

    return this.theme[current];
  };

  onClick = () => {
    const { onClick, data, } = this.props;
    const rect = this.wrapRef.current.getBoundingClientRect();
    if (onClick) onClick({ id: data.id, rect, });
  };

  onMouseEnter = () => {
    const { data, } = this.props;
    this.setState({ hover: true, });
    fireEvent(`info-${data.id}`, 'mouseover');
  };

  onMouseLeave = () => {
    const { data, } = this.props;
    this.setState({ hover: false, });
    fireEvent(`info-${data.id}`, 'mouseout');
  };

  render() {
    const { data, active } = this.props;
    const theme = this.currentTheme();
    const props = active
      ? {
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
      }
      : {};

    return (
      <g
        id={`region-${data.id}`}
        ref={this.wrapRef}
        onClick={this.onClick}
        {...props}
        {...data.translate && { transform: `translate(${data.translate})`, }}
      >
        <path d={data.path} {...theme} />
      </g>
    );
  }
}


export default withTheme(Region);
