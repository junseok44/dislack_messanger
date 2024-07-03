// src/contexts/AuthContext.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";
import { AUTH_TOKEN } from "@/constants/constants";
import { setItem, getItem, removeItem } from "@/lib/localStorage";

// Mock localStorage functions
jest.mock("@/lib/localStorage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const TestComponent = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <div>Authenticated: {isAuthenticated.toString()}</div>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    (getItem as jest.Mock).mockReturnValue("");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with isAuthenticated as false", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText("Authenticated: false")).toBeInTheDocument();
  });

  test("should log in correctly", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Login"));

    expect(setItem).toHaveBeenCalledWith(AUTH_TOKEN, "token");
    expect(screen.getByText("Authenticated: true")).toBeInTheDocument();
  });

  test("should log out correctly", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText("Logout"));

    expect(removeItem).toHaveBeenCalledWith(AUTH_TOKEN);
    expect(screen.getByText("Authenticated: false")).toBeInTheDocument();
  });

  test("should set isAuthenticated to true if token exists", () => {
    (getItem as jest.Mock).mockReturnValue("token");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText("Authenticated: true")).toBeInTheDocument();
  });

  test("should not set isAuthenticated to true if token does not exist", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText("Authenticated: false")).toBeInTheDocument();
  });
});

export {};
