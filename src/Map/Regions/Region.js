import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { withTheme, } from 'styled-components';
import { getTheme } from '../../utils';
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
  };

  static defaultProps = {
    theme: defaultTheme,
    onClick: undefined,
    active: false,
    inactive: false,
  };

  state = {
    hover: false,
  };

  wrapRef = React.createRef();

  theme = {};

  currentTheme = () => {
    const { active, theme, inactive } = this.props;
    const { hover, } = this.state;
    let current = 'normal';
    if (active) current = 'active';
    if (hover) current = 'hover';
    if (inactive) current = 'inactive';

    if (!this.theme[current]) this.theme[current] = getTheme(theme, `Map.Region.${current}`);

    return this.theme[current];
  };

  onClick = () => {
    const { onClick, data, } = this.props;
    const rect = this.wrapRef.current.getBoundingClientRect();
    if (onClick) onClick({ id: data.id, rect });
  };

  onMouseEnter = () => this.setState({ hover: true, });

  onMouseLeave = () => this.setState({ hover: false, });

  render() {
    const { data, inactive } = this.props;
    const theme = this.currentTheme();
    const props = inactive
      ? {}
      : {
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        onClick: this.onClick,
      };

    return (
      <g
        id={`region-${data.id}`}
        ref={this.wrapRef}
        {...props}
      >
        <path d={data.path} {...theme} />
      </g>
    );
  }
}


export default withTheme(Region);
