import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { HomeScreen } from '@/screens/HomeScreen';
import { sampleSession, sampleUser } from '../../fixtures/data';

const mockUseFeed = jest.fn();

jest.mock('@/hooks/useFeed', () => ({
  useFeed: (...args: unknown[]) => mockUseFeed(...args),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows empty state when feed is empty', () => {
    // Ensures empty feed renders messaging and switch action.
    mockUseFeed.mockReturnValue({
      data: [],
      usersById: {},
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    });

    const { getByText } = render(
      <HomeScreen currentUser={sampleUser} onOpenSession={jest.fn()} />,
    );

    expect(getByText('No sessions yet')).toBeTruthy();
    expect(getByText('Switch to All')).toBeTruthy();
  });

  test('invokes onOpenSession when a card is pressed', () => {
    // Confirms session card press calls onOpenSession with session data.
    const onOpenSession = jest.fn();
    mockUseFeed.mockReturnValue({
      data: [sampleSession],
      usersById: { [sampleUser.id]: sampleUser },
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    });

    const { getByText } = render(
      <HomeScreen currentUser={sampleUser} onOpenSession={onOpenSession} />,
    );

    fireEvent.press(getByText(sampleSession.title));

    expect(onOpenSession).toHaveBeenCalledWith(sampleSession);
  });
});
