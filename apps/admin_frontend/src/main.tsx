import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer, Bounce } from "react-toastify";
import "./index.css";
import App from "./App.tsx";
import Login from "./components/Login.tsx";
import Signup from "./components/Signup.tsx";
import AuthRoute from "./components/AuthRoute.tsx";
import CreateCourse from "./components/course/CreateCourse.tsx";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthRoute isProtected={true}>
            <div className="bg-white">Home</div>
          </AuthRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthRoute isProtected={false}>
            <Login />
          </AuthRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthRoute isProtected={false}>
            <Signup />
          </AuthRoute>
        ),
      },
      {
        path: "/create-course",
        element: (
          <AuthRoute isProtected={true}>
            <CreateCourse />
          </AuthRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
