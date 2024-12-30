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
import Home from "./components/Home.tsx";
import Account from "./components/Account.tsx";
import CoursePage from "./components/course/CoursePage.tsx";
import CreateSection from "./components/course/section/CreateSection.tsx";
import Analytics from "./components/Analytics.tsx";
import UploadContent from "./components/course/section/UpploadSectionContent.tsx";

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
        path: "/create-course",
        element: (
          <AuthRoute isProtected={true}>
            <CreateCourse />
          </AuthRoute>
        ),
      },
      {
        path: "/account-setting",
        element: (
          <AuthRoute isProtected={true}>
            <Account />
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
        path: "/course/:courseId/create-section",
        element: (
          <AuthRoute isProtected={true}>
            <CreateSection />
          </AuthRoute>
        ),
      },
      {
        path: "/course/:courseId/edit-section/:sectionId/upload-content",
        element: (
          <AuthRoute isProtected={true}>
            <UploadContent />
          </AuthRoute>
        ),
      },
      {
        path: "/analytics",
        element: (
          <AuthRoute isProtected={true}>
            <Analytics />
          </AuthRoute>
        ),
      },
      {
        path: "*",

        element: (
          <h1 className="text-3xl font-bold underline text-white">404</h1>
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
