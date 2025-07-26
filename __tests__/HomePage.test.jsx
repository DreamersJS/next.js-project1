// First: Mock firebase/database at the top
jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  child: jest.fn(),
  get: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 'whiteboard1', content: '', photo: '' }),
  })
);

import { getDatabase, ref, child, get } from 'firebase/database';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '@/app/page';
import { RecoilRoot } from 'recoil';
import { userState } from "@/recoil/atoms/userAtom";
import { act } from 'react';

const mockUser = {
  uid: '123',
  email: 'test@example.com',
  username: 'tester',
  avatar: '/avatar.png',
  listOfWhiteboardIds: [],
  role: 'registered',
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

afterEach(() => {
  jest.clearAllMocks(); // reset mock states
});

it('renders homepage', async () => {
  const mockDb = {};
  const mockUserRef = { mockRef: true };
  const mockWhiteboardsRef = { mockRef: 'whiteboardsRef' };

  getDatabase.mockReturnValue(mockDb);
  ref.mockImplementation(() => mockUserRef);
  child.mockImplementation(() => mockWhiteboardsRef);
  get.mockResolvedValue({
    exists: () => true,
    val: () => ({ whiteboard1: { name: 'Test Board' } }), // optional data
  });

  await act(async () => {
    render(
      <RecoilRoot initializeState={({ set }) => set(userState, mockUser)}>
        <HomePage />
      </RecoilRoot>
    );
  });

  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /welcome to the whiteboard app/i })).toBeInTheDocument()
  );
});
