import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import Mainlayout from "./layout/Mainlayout";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import EditProfile from "./pages/student/EditProfile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import AllCourses from "./pages/admin/course/AllCourses";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLacture from "./pages/admin/lecture/CreateLacture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: <AuthenticatedUser><Login /></AuthenticatedUser>,
      },
      {
        path: "myLearning",
        element: <ProtectedRoute><MyLearning /></ProtectedRoute>,
      },
      {
        path: "profile",
        element: <ProtectedRoute> <Profile /></ProtectedRoute>,
      },
      {
        path: "editProfile",
        element: <EditProfile />,
      },
      {
        path: "course/search",
        element: <ProtectedRoute><SearchPage /></ProtectedRoute>,
      },
      {
        path: "course-detail/:courseId",
        element: <ProtectedRoute><CourseDetail /></ProtectedRoute>,
      },
      {
        path: "course-progress/:courseId",
        element: <ProtectedRoute>
          <PurchaseCourseProtectedRoute>
            <CourseProgress />
          </PurchaseCourseProtectedRoute>
        </ProtectedRoute>,
      },


      // admin routes start from here
      {
        path: "admin",
        element: <AdminRoute><Sidebar /></AdminRoute>,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "courses",
            element: <AllCourses />,
          },
          {
            path: "courses/create",
            element: <AddCourse />
          },
          {
            path: "courses/:courseId",
            element: <EditCourse />
          },
          {
            path: "courses/:courseId/lecture",
            element: <CreateLacture />
          },
          {
            path: "courses/:courseId/lecture/:lectureId",
            element: <EditLecture />
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
}

export default App;
