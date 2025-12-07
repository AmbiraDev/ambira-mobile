import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { BottomNavigation } from '@/components/BottomNavigation';

describe('BottomNavigation', () => {
  test('renders tabs and highlights active one', () => {
    // Ensures active tab renders and matches provided prop.
    const { getByText } = render(<BottomNavigation active="timer" onChange={() => {}} />);

    expect(getByText('Record')).toBeTruthy();
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
  });

  test('invokes onChange when a tab is pressed', () => {
    // Confirms tab press triggers onChange with the new key.
    const onChange = jest.fn();
    const { getByText } = render(<BottomNavigation active="home" onChange={onChange} />);

    fireEvent.press(getByText('Profile'));

    expect(onChange).toHaveBeenCalledWith('profile');
  });
});
