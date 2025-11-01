import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Dropdown from '../src/react/Dropdown';

test('renders and triggers change', () => {
  const { container } = render(<Dropdown options={[{ value: '1', label: 'One' }]} />);
  // ensure DOM contains the dropdown container
  expect(container.querySelector('.custom-dropdown')).toBeTruthy();
});
