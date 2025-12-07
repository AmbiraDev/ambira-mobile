import React from 'react';
import { Share } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import { SessionCard } from '@/components/SessionCard';
import { sampleSession, sampleUser } from '../../fixtures/data';

jest.mock('@/components/Avatar', () => ({
  Avatar: () => <div />,
  __esModule: true,
}));

describe('SessionCard', () => {
  beforeEach(() => {
    jest.spyOn(Share, 'share').mockResolvedValue({} as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('toggles support count and calls callback', () => {
    // Ensures tapping support updates count and emits toggle callback.
    const onSupportToggle = jest.fn();
    const { getByText } = render(
      <SessionCard
        session={{ ...sampleSession, supports: 0, shares: 5 }}
        user={sampleUser}
        onSupportToggle={onSupportToggle}
      />,
    );

    fireEvent.press(getByText('0'));
    expect(onSupportToggle).toHaveBeenCalledWith(sampleSession.id, true);

    fireEvent.press(getByText('1'));
    expect(onSupportToggle).toHaveBeenCalledWith(sampleSession.id, false);
  });

  test('falls back to native share when onShare is not provided', async () => {
    // Confirms pressing share triggers react-native Share when no custom handler exists.
    const { getAllByText } = render(
      <SessionCard session={sampleSession} user={sampleUser} />,
    );

    fireEvent.press(getAllByText(String(sampleSession.shares))[0]);

    expect(Share.share).toHaveBeenCalled();
  });
});
