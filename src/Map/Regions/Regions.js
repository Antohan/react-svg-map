import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Region from './Region';
import District from './District';


export default class Regions extends Component {
  static displayName = 'Regions';

  static propTypes = {
    data: PropTypes.array.isRequired,
    currentId: PropTypes.string.isRequired,
    onMount: PropTypes.func.isRequired,
    onRegionMount: PropTypes.func.isRequired,
    onRegionUnmount: PropTypes.func.isRequired,
    onRegionClick: PropTypes.func,
  };

  static defaultProps = {
    onRegionClick: undefined,
  };

  wrapRef = React.createRef();

  childrenRef = React.createRef();

  componentDidMount() {
    const { onMount } = this.props;
    onMount(this.wrapRef, this.childrenRef);
  }

  render() {
    const {
      data,
      currentId,
      onRegionClick,
      onRegionMount,
      onRegionUnmount,
    } = this.props;

    const region = data.find(r => r.id === currentId);
    if (!region) return (null);

    return (
      <svg
        id="regions-layer"
        ref={this.wrapRef}
        viewBox="0 0 1000 568"
        preserveAspectRatio="xMinYMin meet"
        width="100%"
        height="100%"
      >
        <g ref={this.childrenRef}>
          {region.children && (
            <District
              key={region.id}
              data={data}
              region={region}
              onClick={onRegionClick}
              onMount={onRegionMount}
              onUnmount={onRegionUnmount}
            />
          )}
          {region.path && (
            <Region
              key={region.id}
              {...region}
              onClick={onRegionClick}
              onMount={onRegionMount}
              onUnmount={onRegionUnmount}
            />
          )}
        </g>
      </svg>
    );
  }
}
