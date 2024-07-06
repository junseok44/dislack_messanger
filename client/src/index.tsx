import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorFallback from "./components/ErrorFallback";
import ChakraContext from "./contexts/ChakraContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // window.location.reload();
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <ChakraContext>
            <App />
          </ChakraContext>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </QueryClientProvider>
);
