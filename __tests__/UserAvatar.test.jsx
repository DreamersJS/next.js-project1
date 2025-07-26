// __tests__/UserAvatar.test.jsx
import { render, screen } from '@testing-library/react';
import UserAvatar from '@/components/UserAvatar';
import { RecoilRoot } from 'recoil';
import { userState } from '@/recoil/atoms/userAtom';

const mockUser = {
  uid: '123',
  email: 'test@example.com',
  username: 'tester',
  avatar: '/avatar.png',
  listOfWhiteboardIds: [],
  role: 'registered',
};

describe('UserAvatar', () => {
  it('renders avatar and username when user is present', () => {
    render(
      <RecoilRoot initializeState={({ set }) => set(userState, mockUser)}>
        <UserAvatar />
      </RecoilRoot>
    );

    const avatarElement = screen.getByRole('img');
    const usernameElement = screen.getByText('tester');

    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement).toHaveAttribute('src', '/avatar.png');
    expect(usernameElement).toBeInTheDocument();
  });

  it('renders nothing when user is not logged in', () => {
    const emptyUser = {
      uid: null,
      email: null,
      username: null,
      avatar: null,
      listOfWhiteboardIds: [],
      role: null,
    };

    render(
      <RecoilRoot initializeState={({ set }) => set(userState, emptyUser)}>
        <UserAvatar />
      </RecoilRoot>
    );

    const avatarElement = screen.queryByRole('img');
    const usernameElement = screen.queryByText('tester');

    expect(avatarElement).not.toBeInTheDocument();
    expect(usernameElement).not.toBeInTheDocument();
  });
});
