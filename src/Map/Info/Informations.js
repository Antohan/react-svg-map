import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Info from './Info';


export default class Informations extends PureComponent {
  static displayName = 'Informations';

  static propTypes = {
    data: PropTypes.array.isRequired,
    regions: PropTypes.array.isRequired,
    onInfoMount: PropTypes.func,
  };

  static defaultProps = {
    onInfoMount: undefined,
  };

  renderInfo = (info) => {
    const { regions, onInfoMount } = this.props;

    const region = regions.find(r => r.id === info.region);
    if (!region) return (null);

    return (
      <Info key={info.region} {...info} title={region.title} onMount={onInfoMount} />
    );
  };

  render() {
    const { data } = this.props;

    return (
      <React.Fragment>
        {data.map(this.renderInfo)}
      </React.Fragment>
    );
  }
}
