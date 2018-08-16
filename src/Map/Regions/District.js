import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { withTheme, } from 'styled-components';
import Region from './Region';
import { getTheme, } from '../../utils';
import defaultTheme from '../../theme/defaultTheme';


class District extends PureComponent {
  static displayName = 'District';

  static propTypes = {
    theme: PropTypes.object,
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      size: PropTypes.arrayOf(PropTypes.number).isRequired,
      center: PropTypes.arrayOf(PropTypes.number).isRequired,
      children: PropTypes.array.isRequired,
    }).isRequired,
    selectedId: PropTypes.string,
    mapId: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    theme: defaultTheme,
    selectedId: null,
  };

  state = {
    hover: false,
  };

  wrapRef = React.createRef();

  theme = {};

  currentTheme = () => {
    const { data, selectedId, mapId, theme, } = this.props;
    const { hover, } = this.state;
    const active = data.id === selectedId;
    const inactive = (!!selectedId && (selectedId !== mapId)) && !active;

    let current = 'normal';
    if (active) current = 'active';
    if (hover) current = 'hover';
    if (inactive) current = 'inactive';

    if (!this.theme[current]) this.theme[current] = getTheme(theme, `Map.District.${current}`);

    return this.theme[current];
  };

  onMouseEnter = () => {
    this.setState({ hover: true, });
    const parent = this.wrapRef.current.parentNode;
    parent.removeChild(this.wrapRef.current);
    parent.appendChild(this.wrapRef.current);
  };

  onMouseLeave = () => {
    this.setState({ hover: false, });
  };

  onClick = (target) => {
    const { onClick, data, } = this.props;
    const rect = this.wrapRef.current.getBoundingClientRect();
    onClick({ id: data.id, rect, target, });
  };

  render() {
    const { data, selectedId, mapId, } = this.props;
    const { hover, } = this.state;
    const theme = this.currentTheme();
    const active = data.id === selectedId;
    const inactive = (!!selectedId && (selectedId !== mapId)) && !active;

    return (
      <g
        id={`region-${data.id}`}
        ref={this.wrapRef}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {data.children.map(child => (
          <Region
            key={child.id}
            data={child}
            selectedId={selectedId}
            hovered={hover}
            active={active}
            inactive={inactive}
            onClick={this.onClick}
          />
        ))}
        <path d={data.path} {...theme} style={{ pointerEvents: 'none', }} />
      </g>
    );
  }
}

export default withTheme(District);
