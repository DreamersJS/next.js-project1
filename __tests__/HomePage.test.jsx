jest.mock('@/services/firebase'); // mock Firebase module BEFORE importing anything that uses it

import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '@/app/page'; // Adjust import if needed
import { RecoilRoot } from 'recoil';
import { userState } from "@/recoil/atoms/userAtom";
// import { act } from 'react-dom/test-utils';
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

  jest.mock('@/services/firebase');

  it('renders homepage', async () => {
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
  
