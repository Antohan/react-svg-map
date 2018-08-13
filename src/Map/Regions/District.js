import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import Region from './Region';


export default class District extends PureComponent {
  static displayName = 'District';

  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      size: PropTypes.arrayOf(PropTypes.number).isRequired,
      center: PropTypes.arrayOf(PropTypes.number).isRequired,
      children: PropTypes.array.isRequired,
    }),
    selectedId: PropTypes.string,
    mapId: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedId: null,
  };

  state = {
    hover: false,
  };

  wrapRef = React.createRef();

  onMouseEnter = () => this.setState({ hover: true, });

  onMouseLeave = () => this.setState({ hover: false, });

  onClick = (target) => {
    const { onClick, data } = this.props;
    const rect = this.wrapRef.current.getBoundingClientRect();
    onClick({ id: data.id, rect, target });
  };

  render() {
    const { data, selectedId, mapId } = this.props;
    const { hover } = this.state;
    const active = data.id === selectedId;
    const inactive = (!!selectedId && (selectedId !== mapId)) && !active;
    const props = inactive
      ? {}
      : {
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
      };

    return (
      <g
        id={`region-${data.id}`}
        ref={this.wrapRef}
        {...props}
      >
        {data.children.map(child => (
          <Region
            key={child.id}
            data={child}
            selectedId={selectedId}
            active={active || hover}
            inactive={inactive}
            onClick={this.onClick}
          />
        ))}
      </g>
    );
  }
}
