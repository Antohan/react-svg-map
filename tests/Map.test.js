import React from 'react';
import { shallow, } from 'enzyme';
import Map from '../src';

describe('Input', () => {
  it('Should renders without problems', () => {
    shallow(<Map />);
  });
});
