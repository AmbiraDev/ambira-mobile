import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';

import { RecordScreen } from '@/screens/RecordScreen';

describe('RecordScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('finishes timer and emits review draft', () => {
    // Ensures timer flow produces a draft with duration and visibility.
    const onStartReview = jest.fn();
    const { getByText } = render(
      <RecordScreen onStartReview={onStartReview} defaultVisibility="followers" />,
    );

    fireEvent.press(getByText('Start'));
    act(() => {
      jest.advanceTimersByTime(12 * 60 * 1000);
    });
    fireEvent.press(getByText('Pause'));
    fireEvent.press(getByText('Finish'));

    expect(onStartReview).toHaveBeenCalledWith(
      expect.objectContaining({
        durationMinutes: expect.any(Number),
        visibility: 'followers',
      }),
    );
  });
});
