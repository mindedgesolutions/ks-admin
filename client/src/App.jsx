import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  AdminLayout,
  AgencyInfo,
  ApplicationList,
  ApplicationSingle,
  BankInfo,
  BskApplicationStatus,
  ChangePassword,
  Dashboard,
  Documents,
  DsApplicationStatus,
  DsDeo,
  DsMigrationStatus,
  Error,
  FamilyInfo,
  ForgotPassword,
  KsApplicationStatus,
  Landing,
  Layout,
  Login,
  Logout,
  Notifications,
  PersonalInfo,
  Reports,
  Schemes,
  SdStaticAtFive,
  UpdateProfile,
  UserCredentialLogin,
  UserDashboard,
  UserError,
  UserForgotPassword,
  UserLayout,
  UserOtpLogin,
  UserSignUp,
  WebsiteError,
  WebsiteLayout,
  WebsiteNotifications,
  WorksiteInfo,
} from "./pages";

// Admin actions
import { action as loginAction } from "./pages/admin/Login";
import { action as profileAction } from "./pages/admin/profile/UpdateProfile";
import { action as passwordAction } from "./pages/admin/profile/ChangePassword";

// Admin loaders
import { loader as adminLayoutLoader } from "./pages/admin/AdminLayout";
import { loader as profileLoader } from "./pages/admin/profile/UpdateProfile";
import { loader as dsDistrictsApp } from "./pages/admin/reports/ds/DsApplicationStatus";
import { loader as dsDistrictsMig } from "./pages/admin/reports/ds/DsMigrationStatus";
import { loader as dsApplicationList } from "./pages/admin/applications/ApplicationList";
import { loader as applicationSingle } from "./pages/admin/applications/ApplicationSingle";

// Website loaders

// Website actions
import { action as userOtpLogin } from "./components/user/website/OtpLoginForm";

// User loaders
import { loader as userLayoutLoader } from "./pages/user/portal/UserLayout";
import { loader as banks } from "./pages/user/portal/applications/BankInfo";
import { loader as schemes } from "./pages/user/portal/applications/FamilyInfo";
import { loader as personalInfo } from "./pages/user/portal/applications/PersonalInfo";
import { loader as worksiteInfo } from "./pages/user/portal/applications/WorksiteInfo";
import { loader as agencyInfo } from "./pages/user/portal/applications/AgencyInfo";

const router = createBrowserRouter([
  // Website routes start ------
  {
    path: "/",
    element: <WebsiteLayout />,
    errorElement: <WebsiteError />,
    children: [
      { index: true, element: <Landing /> },
      { path: "notifications", element: <WebsiteNotifications /> },
      { path: "schemes", element: <Schemes /> },
      { path: "otplogin", element: <UserOtpLogin />, action: userOtpLogin },
      { path: "sign-up", element: <UserSignUp /> },
      { path: "user-login", element: <UserCredentialLogin /> },
      { path: "forgot-password", element: <UserForgotPassword /> },
    ],
  },
  // Website routes end ------
  // User application routes start ------
  {
    path: "/user",
    element: <UserLayout />,
    errorElement: <UserError />,
    loader: userLayoutLoader,
    children: [
      { path: "dashboard", element: <UserDashboard /> },
      {
        path: "personal-info",
        element: <PersonalInfo />,
        loader: personalInfo,
      },
      {
        path: "worksite-info",
        element: <WorksiteInfo />,
        loader: worksiteInfo,
      },
      { path: "agency-info", element: <AgencyInfo />, loader: agencyInfo },
      { path: "nominee-info", element: <BankInfo />, loader: banks },
      { path: "family-info", element: <FamilyInfo />, loader: schemes },
      { path: "documents", element: <Documents /> },
    ],
  },
  // User application routes end ------
  // Admin panel routes start ------
  {
    path: "/admin",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      { path: "login", element: <Login />, action: loginAction },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "logout", element: <Logout /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <Error />,
    loader: adminLayoutLoader,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "profile",
        element: <UpdateProfile />,
        loader: profileLoader,
        action: profileAction,
      },
      { path: "notifications", element: <Notifications /> },
      {
        path: "change-password",
        element: <ChangePassword />,
        action: passwordAction,
      },
      {
        path: "applications",
        element: <ApplicationList />,
        errorElement: <Error />,
        loader: dsApplicationList,
      },
      {
        path: "applications/:id",
        element: <ApplicationSingle />,
        errorElement: <Error />,
        loader: applicationSingle,
      },
      {
        path: "reports",
        errorElement: <Error />,
        children: [
          { index: true, element: <Reports /> },
          {
            path: "bsk/application-status",
            element: <BskApplicationStatus />,
          },
          {
            path: "ds/application-status",
            element: <DsApplicationStatus />,
            loader: dsDistrictsApp,
          },
          {
            path: "ds/deo",
            element: <DsDeo />,
          },
          {
            path: "ds/migration-status",
            element: <DsMigrationStatus />,
            loader: dsDistrictsMig,
          },
          {
            path: "ks/application-status",
            element: <KsApplicationStatus />,
          },
          {
            path: "sd/static",
            element: <SdStaticAtFive />,
          },
        ],
      },
    ],
  },
  // Admin panel routes end ------
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
