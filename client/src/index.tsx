import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "react-error-boundary";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ErrorFallback from "./components/ErrorFallback";
import ModalProvider from "./contexts/ModalContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // console.log(error);
    },
  }),
});

root.render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
      <BrowserRouter>
        <AuthProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </QueryClientProvider>
);
