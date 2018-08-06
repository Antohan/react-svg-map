import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Region from './Region';


export default class District extends PureComponent {
  static displayName = 'District';

  static propTypes = {
    data: PropTypes.array.isRequired,
    region: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    onMount: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onClick: undefined,
  };

  state = {
    active: false,
  };

  wrapRef = React.createRef();

  componentDidMount() {
    const { onMount, region } = this.props;
    if (onMount) onMount({ id: region.id, ref: this.wrapRef });
  }

  onClick = (target) => {
    const { onClick, region } = this.props;
    const rect = this.wrapRef.current.getBoundingClientRect();
    if (onClick) {
      onClick({
        id: region.id, rect, target,
      });
    }

    this.setState(oldState => ({ active: !oldState.active }));
  };

  renderChildren = (child) => {
    const { data, onClick, onMount } = this.props;
    const { active } = this.state;

    const region = data.find(r => r.id === child);
    if (!region) return (null);

    if (region.children) {
      return (
        <District
          key={region.id}
          data={data}
          region={region}
          onClick={onClick}
          onMount={onMount}
        />
      );
    }

    return (
      <Region
        key={region.id}
        {...region}
        onClick={this.onClick}
        active={active}
        onMount={onMount}
      />
    );
  };

  render() {
    const { region } = this.props;

    return (
      <g ref={this.wrapRef}>
        {region.children.map(this.renderChildren)}
      </g>
    );
  }
}
