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
    checkHover: PropTypes.bool,
  };

  static defaultProps = {
    onClick: undefined,
    checkHover: false,
  };

  state = {
    hover: false,
    active: false,
  };

  wrapRef = React.createRef();

  componentDidMount() {
    const { onMount, region } = this.props;
    if (onMount) onMount({ id: region.id, ref: this.wrapRef });
  }

  onMouseEnter = () => this.setState({ hover: true });

  onMouseLeave = () => this.setState({ hover: false });

  onClick = () => {
    const { region } = this.props;
    const rect = this.wrapRef.current.getBoundingClientRect();

    this.onRegionClick({ id: region.id, rect });
    this.setState(oldState => ({ active: !oldState.active }));
  };

  onRegionClick = (target) => {
    const { onClick, region } = this.props;
    const rect = this.wrapRef.current.getBoundingClientRect();
    if (onClick) {
      onClick({
        id: region.id, rect, target,
      });
    }
  };

  renderChildren = (child) => {
    const { data, onClick, onMount, checkHover } = this.props;
    const { hover, active } = this.state;

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
          checkHover
        />
      );
    }

    return (
      <Region
        key={region.id}
        {...region}
        onClick={checkHover ? null : this.onRegionClick}
        isActive={hover || active}
        onMount={onMount}
      />
    );
  };

  render() {
    const { region, checkHover } = this.props;

    if (checkHover) {
      return (
        <g
          ref={this.wrapRef}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}
        >
          {region.children.map(this.renderChildren)}
        </g>
      );
    }

    return (
      <g ref={this.wrapRef}>
        {region.children.map(this.renderChildren)}
      </g>
    );
  }
}
