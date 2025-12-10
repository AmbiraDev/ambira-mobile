import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Animated } from 'react-native';

import { ReviewScreen } from '@/screens/ReviewScreen';

// Mock Animated timing to prevent animation errors in tests
jest.spyOn(Animated, 'timing').mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  reset: jest.fn(),
}));

const baseDraft = {
  title: 'Draft title',
  description: '',
  activityId: 'build',
  durationMinutes: 30,
  visibility: 'everyone' as const,
  media: [],
};

describe('ReviewScreen', () => {
  test('saves with fallback title and updated visibility', async () => {
    // Ensures save uses default title when input is empty and respects visibility change.
    const onSave = jest.fn().mockResolvedValue(undefined);
    const { getByText, getByPlaceholderText } = render(
      <ReviewScreen draft={baseDraft} onSave={onSave} onDiscard={jest.fn()} />,
    );

    fireEvent.changeText(getByPlaceholderText('Session title'), '');
    fireEvent.press(getByText('Followers'));
    fireEvent.press(getByText('Save Session'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Session', visibility: 'followers' }),
      );
    });
  });

  test('toggles photo list on add/remove', () => {
    // Confirms photo toggle adds then removes placeholder photo.
    const { getByText, queryByText } = render(
      <ReviewScreen draft={baseDraft} onSave={jest.fn()} onDiscard={jest.fn()} />,
    );

    fireEvent.press(getByText('Add photo'));
    expect(getByText('Remove photo')).toBeTruthy();

    fireEvent.press(getByText('Remove photo'));
    expect(queryByText('Remove photo')).toBeNull();
    expect(getByText('Add photo')).toBeTruthy();
  });
});
