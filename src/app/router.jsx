import { createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";

// Admin Dashboard Imports
import Login from "../views/Login.jsx";
import DashboardLayout from "../views/DashboardLayout.jsx";
import AuthWrapper from "../components/AuthWrapper.jsx";
import OwnersList from "../views/OwnersList.jsx";
import PropertiesList from "../views/PropertiesList.jsx";
import AllPropertiesList from "../views/AllPropertiesList.jsx";
import PendingApprovals from "../views/PendingApprovals.jsx";
import MasterDataConfig from "../views/MasterDataConfig.jsx";
import AdminConfig from "../views/AdminConfig.jsx";
import GlobalAdminDashboard from "../views/GlobalAdminDashboard.jsx";

import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";

import ProtectedRoute from "../features/auth/components/ProtectedRoute.jsx";

import OwnerLayout from "../layouts/OwnerLayout/OwnerLayout.jsx";
import OwnerDashboardPage from "../features/owner-dashboard/pages/OwnerDashboardPage.jsx";

import MyPropertiesPage from "../features/properties/pages/MyPropertiesPage.jsx";
import AddPropertyPage from "../features/properties/pages/AddPropertyPage.jsx";
import ManagePropertyPage from "../features/properties/pages/ManagePropertyPage.jsx";

import RoomsPage from "../features/rooms/pages/RoomsPage.jsx";
import AddRoomPage from "../features/rooms/pages/AddRoomPage.jsx";
import EditRoomPage from "../features/rooms/pages/EditRoomPage.jsx";
import EmployeesPage from "../features/employees/pages/EmployeesPage.jsx";
import BookingsPage from "../features/owner/pages/BookingsPage.jsx";
import AvailabilityPage from "../features/owner/pages/AvailabilityPage.jsx";
import InventoryCalendarPage from "../features/inventory/pages/InventoryCalendarPage.jsx";
import InventorySetupPage from "../features/inventory/pages/InventorySetupPage.jsx";
import RoomBlocksPage from "../features/inventory/pages/RoomBlocksPage.jsx";
import StopSellPage from "../features/inventory/pages/StopSellPage.jsx";
import InventoryHistoryPage from "../features/inventory/pages/InventoryHistoryPage.jsx";
import PricingPage from "../features/owner/pages/PricingPage.jsx";
import ReviewsPage from "../features/owner/pages/ReviewsPage.jsx";
import PaymentsPage from "../features/owner/pages/PaymentsPage.jsx";
import ReportsPage from "../features/owner/pages/ReportsPage.jsx";
import SettingsPage from "../features/owner/pages/SettingsPage.jsx";
import ProfilePage from "../features/owner/pages/ProfilePage.jsx";

import { ROUTES } from "../constants/routes.js";

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
  },

  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },

  {
    path: "/employee/login",
    element: <LoginPage />,
  },

  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <OwnerLayout />,
        children: [
          {
            path: ROUTES.OWNER_DASHBOARD,
            element: <OwnerDashboardPage />,
          },

          {
            path: ROUTES.OWNER_PROPERTIES,
            element: <MyPropertiesPage />,
          },

          {
            path: ROUTES.OWNER_ADD_PROPERTY,
            element: <AddPropertyPage />,
          },

          {
            path: "/owner/properties/:propertyId",
            element: <ManagePropertyPage />,
          },

          {
            path: ROUTES.OWNER_ROOMS,
            element: <RoomsPage />,
          },

          {
            path: "/owner/rooms/add",
            element: <AddRoomPage />,
          },

          {
            path: "/owner/rooms/:roomId/edit",
            element: <EditRoomPage />,
          },

          {
            path: ROUTES.OWNER_EMPLOYEES,
            element: <EmployeesPage />,
          },

          {
            path: ROUTES.OWNER_BOOKINGS,
            element: <BookingsPage />,
          },

          {
            path: ROUTES.OWNER_AVAILABILITY,
            element: <InventoryCalendarPage />,
          },

          {
            path: ROUTES.OWNER_INVENTORY,
            element: <InventoryCalendarPage />,
          },

          {
            path: ROUTES.OWNER_INVENTORY_SETUP,
            element: <InventorySetupPage />,
          },

          {
            path: ROUTES.OWNER_INVENTORY_BLOCKS,
            element: <RoomBlocksPage />,
          },

          {
            path: ROUTES.OWNER_INVENTORY_STOP_SELL,
            element: <StopSellPage />,
          },

          {
            path: ROUTES.OWNER_INVENTORY_HISTORY,
            element: <InventoryHistoryPage />,
          },

          {
            path: ROUTES.OWNER_PRICING,
            element: <PricingPage />,
          },

          {
            path: ROUTES.OWNER_REVIEWS,
            element: <ReviewsPage />,
          },

          {
            path: ROUTES.OWNER_PAYMENTS,
            element: <PaymentsPage />,
          },

          {
            path: ROUTES.OWNER_REPORTS,
            element: <ReportsPage />,
          },

          {
            path: ROUTES.OWNER_SETTINGS,
            element: <SettingsPage />,
          },

          {
            path: ROUTES.OWNER_PROFILE,
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  // Admin Ecosystem
  {
    path: "/admin",
    element: <AuthWrapper />,
    children: [
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <GlobalAdminDashboard /> },
          { path: "owners", element: <OwnersList /> },
          { path: "owners/:ownerId/properties", element: <PropertiesList /> },
          { path: "properties", element: <AllPropertiesList /> },
          { path: "pending", element: <PendingApprovals /> },
          { path: "master-data", element: <MasterDataConfig /> },
          { path: "settings", element: <AdminConfig /> }
        ]
      }
    ]
  },
  {
    path: "/admin/login",
    element: <Login />
  }
]);

export default router;