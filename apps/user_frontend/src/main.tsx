import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer, Bounce } from "react-toastify";
import "./index.css";
import App from "./App.tsx";
import Home from "./components/Home.tsx";
import AuthRoute from "./components/AuthRoute.tsx";
import Login from "./components/Login.tsx";
import Signup from "./components/Signup.tsx";
import Purchases from "./components/course/Purchases.tsx";
import CoursePage from "./components/course/CoursePage.tsx";
import WatchHistory from "./components/course/WatchHistory.tsx";
import PageNotFound from "./components/PageNotFound.tsx";
import AccountSettings from "./components/AccountSettings.tsx";
import VideoPlayer from "./components/course/content/VideoPlayer.tsx";

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
            <Home />
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
        path: "/purchases",
        element: (
          <AuthRoute isProtected={true}>
            <Purchases />
          </AuthRoute>
        ),
      },
      {
        path: "/course/:courseId",
        element: (
          <AuthRoute isProtected={true}>
            <CoursePage />
          </AuthRoute>
        ),
      },
      {
        path: "/course/:courseId/:sectionId/:contentId",
        element: (
          <AuthRoute isProtected={true}>
            <VideoPlayer />
          </AuthRoute>
        ),
      },
      {
        path: "/watch-history",
        element: (
          <AuthRoute isProtected={true}>
            <WatchHistory />
          </AuthRoute>
        ),
      },
      {
        path: "/account-setting",
        element: (
          <AuthRoute isProtected={true}>
            <AccountSettings />
          </AuthRoute>
        ),
      },
      {
        path: "*",

        element: <PageNotFound />,
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
