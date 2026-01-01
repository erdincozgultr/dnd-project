import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import store from "./redux/store";
import App from "./App";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

// TanStack Query configuration - Blog için optimize edildi
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 dakika - data fresh kabul edilir
      cacheTime: 10 * 60 * 1000, // 10 dakika - cache'de tutulur
      refetchOnWindowFocus: false, // Pencere focus'ta tekrar fetch etme
      retry: 1, // Hata durumunda 1 kez tekrar dene
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer position="bottom-right" theme="colored" />
      </HelmetProvider>
      {/* TanStack Query DevTools - sadece development'ta görünür */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </Provider>
);