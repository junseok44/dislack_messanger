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
import ErrorFallback from "./components/utils/ErrorFallback";
import ModalProvider from "./contexts/ModalContext";
import ToastProvider from "./contexts/ToastContext";

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
      <ToastProvider>
        <ModalProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ModalProvider>
      </ToastProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);
