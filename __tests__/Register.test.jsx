// 3rd test
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/(auth)/register/page";
import { MemoryRouter } from "react-router";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
    useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
}));

jest.mock("@/hooks/useUser", () => ({
    useUser: jest.fn(() => ({ setUser: jest.fn() })),
}));

jest.mock("@/services/auth", () => ({
    registerUser: jest.fn(() => Promise.resolve({ user: { uid: "123", email: "test@example.com" } })),
    loginUser: jest.fn(() => Promise.resolve({ uid: "123", email: "test@example.com" })),
    createUserProfile: jest.fn(() => Promise.resolve()),
    saveUserToCookie: jest.fn(),
}));

describe('RegisterPage', () => {

    it.each([
        { placeholder: "Username" },
        { placeholder: "Email" },
        { placeholder: "Password" },
    ])("should render $placeholder input field", ({ placeholder }) => {
        render(<RegisterPage />);
        expect(screen.getByPlaceholderText(new RegExp(placeholder, "i"))).toBeInTheDocument();
    });

    it("should render the Register button", () => {
        render(<RegisterPage />);
        expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    });

    it("redirects to provided redirect path after successful registration", async () => {
        const user = userEvent.setup();
        const pushMock = jest.fn();

        // Override the mocks for this specific test
        useRouter.mockReturnValue({ push: pushMock });
        useSearchParams.mockReturnValue({
            get: jest.fn(() => "/whiteboard"),
        });

        render(<RegisterPage />);

        await user.type(screen.getByPlaceholderText(/username/i), "tester");
        await user.type(screen.getByPlaceholderText(/email/i), "test@example.com");
        await user.type(screen.getByPlaceholderText(/password/i), "123456");
        await user.click(screen.getByRole("button", { name: /register/i }));

        await waitFor(() => {
            expect(auth.registerUser).toHaveBeenCalledWith(
                "test@example.com",
                "123456"
            );
            expect(pushMock).toHaveBeenCalledWith("/whiteboard");
        });
    });

    it('should show error message on registration failure', async () => {
        const user = userEvent.setup();
        const { registerUser } = require("@/services/auth");
        registerUser.mockImplementationOnce(() => Promise.reject(new Error("Registration failed")));

        render(<RegisterPage />);
        await user.type(screen.getByPlaceholderText(/username/i), "tester");
        await user.type(screen.getByPlaceholderText(/email/i), "fail@example.com");
        await user.type(screen.getByPlaceholderText(/password/i), "123456");
        await user.click(screen.getByRole("button", { name: /register/i }));

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    })

    // handleRegister calls registerUser(email, password) createUserProfile(uid,username,email,avatarUrl,'registered',{}) loginUser(email, password) saveUserToCookie(userObject)
    // it("creates a user successfully", async () => {})

});