import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../src/app/page';
import { useRouter } from 'next/navigation';
import { createNewWhiteboard } from '../src/services/whiteboardService';
import { useRecoilState } from 'recoil';
import Cookies from 'js-cookie';


// Mocking necessary modules and services
// jest.mock('next/navigation', () => ({
//     useRouter: jest.fn(),
// }));

// jest.mock('../src/app/services/whiteboardService', () => ({
//     createNewWhiteboard: jest.fn(),
// }));

// jest.mock('recoil', () => ({
//     useRecoilState: jest.fn(),
//     atom: jest.fn(),
// }));

// jest.mock('../src/components/WhiteboardList', () => () => <div>Mocked WhiteboardList</div>);

// // Mocking js-cookie
// jest.mock('js-cookie', () => ({
//     get: jest.fn(),
// }));

// describe
describe('HomePage', () => {
    // let mockPush;

    // beforeEach(() => {
    //     // Mock router
    //     mockPush = jest.fn();
    //     useRouter.mockReturnValue({ push: mockPush });

    //     // Mock Recoil state
    //     useRecoilState.mockReturnValue([
    //         { uid: 'test-user', role: 'registered', listOfWhiteboardIds: [] },
    //         jest.fn(),
    //     ]);
    // });

    // afterEach(() => {
    //     jest.clearAllMocks();
    // });

    it('renders the homepage and shows welcome message', () => {
        render(<HomePage />);
        expect(screen.getByRole('heading', { name: /welcome to the whiteboard app/i })).toBeInTheDocument();
        expect(screen.getByText('Create a new whiteboard session or join an existing one.')).toBeInTheDocument();
    });

    // it('redirects to login page if user is not logged in', () => {
    //     // Simulate no user logged in
    //     useRecoilState.mockReturnValue([null, jest.fn()]);

    //     render(<HomePage />);
    //     expect(mockPush).toHaveBeenCalledWith('/login');
    // });

    // it('creates a new whiteboard and redirects to the whiteboard page', async () => {
    //     // Mock whiteboard creation
    //     createNewWhiteboard.mockResolvedValue({ id: 'new-board-id' });

    //     render(<HomePage />);

    //     // Click "Create New Whiteboard" button
    //     const createButton = screen.getByRole('button', { name: /create new whiteboard/i });
    //     fireEvent.click(createButton);

    //     // Wait for the whiteboard creation to complete
    //     await waitFor(() => expect(createNewWhiteboard).toHaveBeenCalledWith('test-user'));

    //     // Ensure redirection happens
    //     expect(mockPush).toHaveBeenCalledWith('/whiteboard/new-board-id');
    // });

    // it('joins an existing whiteboard when ID is provided', () => {
    //     render(<HomePage />);

    //     // Use getByLabelText for the input and getByRole for the button
    //     const input = screen.getByLabelText(/enter whiteboard id/i);
    //     const joinButton = screen.getByRole('button', { name: /join whiteboard/i });

    //     // Simulate entering a whiteboard ID
    //     fireEvent.change(input, { target: { value: 'existing-board-id' } });
    //     fireEvent.click(joinButton);

    //     // Expect the router to push to the correct board
    //     expect(mockPush).toHaveBeenCalledWith('/whiteboard/existing-board-id');
    // });

    // it('disables "Create New Whiteboard" button if the user is not logged in', () => {
    //     // Simulate no user logged in
    //     useRecoilState.mockReturnValue([null, jest.fn()]);
    
    //     render(<HomePage />);
    
    //     const createButton = screen.getByRole('button', { name: /create new whiteboard/i });
        
    //     // Assert that the button is disabled
    //     expect(createButton).toBeDisabled();
    //   });

    // it('renders recent whiteboards for registered users', () => {
    //     render(<HomePage />);

    //     // Assert the lazy-loaded component renders correctly
    //     expect(screen.getByText('Mocked WhiteboardList')).toBeInTheDocument();
    // });
});
