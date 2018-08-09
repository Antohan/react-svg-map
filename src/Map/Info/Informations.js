import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Info from './Info';


export default class Informations extends PureComponent {
  static displayName = 'Informations';

  static propTypes = {
    data: PropTypes.array.isRequired,
    regions: PropTypes.array.isRequired,
    onInfoMount: PropTypes.func.isRequired,
    onInfoUnmount: PropTypes.func.isRequired,
    onInfoClick: PropTypes.func,
  };

  static defaultProps = {
    onInfoClick: null,
  };

  renderInfo = (info) => {
    const { regions, onInfoMount, onInfoUnmount, onInfoClick } = this.props;

    const region = regions.find(r => r.id === info.region);
    if (!region) return (null);

    return (
      <Info
        key={info.region}
        {...info}
        title={region.title}
        onMount={onInfoMount}
        onUnmount={onInfoUnmount}
        onClick={onInfoClick}
      />
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
