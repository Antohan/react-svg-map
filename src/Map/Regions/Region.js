import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import get from 'lodash/get';
import { innerMerge, getThemeAsPlainObjectByKeys } from '../../utils';
import { defaultTheme } from '../../theme/index';


class Region extends PureComponent {
  static displayName = 'Region';

  static propTypes = {
    theme: PropTypes.object,
    onClick: PropTypes.func,
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    onMount: PropTypes.func.isRequired,
  };

  static defaultProps = {
    theme: defaultTheme,
    onClick: undefined,
    isActive: false,
  };

  state = {
    hover: false,
  };

  wrapRef = React.createRef();

  theme = {};

  componentDidMount() {
    const { id, onMount } = this.props;
    if (onMount) onMount({ id, ref: this.wrapRef });
  }

  currentTheme = () => {
    const { theme, isActive } = this.props;
    const { hover } = this.state;
    let current = 'normal';
    if (hover) current = 'hover';
    if (isActive) current = 'active';

    if (!this.theme[current]) {
      const merged = innerMerge(
        {},
        get(defaultTheme, `Map.Region.${current}`, {}),
        get(theme, `Map.Region.${current}`, {}),
      );

      this.theme[current] = getThemeAsPlainObjectByKeys(merged);
    }

    return this.theme[current];
  };

  onClick = () => {
    const { onClick, id } = this.props;
    const rect = this.wrapRef.current.getBoundingClientRect();

    if (onClick) onClick({ id, rect });
  };

  onMouseEnter = () => this.setState({ hover: true });

  onMouseLeave = () => this.setState({ hover: false });

  render() {
    const { path: d, id } = this.props;
    const theme = this.currentTheme();

    return (
      <g
        id={`region-${id}`}
        ref={this.wrapRef}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
      >
        <path d={d} {...theme} />
      </g>
    );
  }
}


export default withTheme(Region);
