import { Navigate } from "react-router-dom";
import store from 'state/store';  // Import your Redux store directly
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";

// Get the current authentication status from the store
const getIsAuthenticated = () => store.getState().global.isAuthenticated;

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: getIsAuthenticated() ? <Dashboard /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "Statistiques",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: getIsAuthenticated() ? <Tables /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "Bon valider",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: getIsAuthenticated() ? <Billing /> : <Navigate to="/authentication/sign-in" />,
  },

  {
    route: "/notifications",
    component: getIsAuthenticated() ? <Notifications /> : <Navigate to="/authentication/sign-in" />,
  },
  {
    type: "collapse",
    name: "Commande",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: getIsAuthenticated() ? <Profile /> : <Navigate to="/authentication/sign-in" />,
  },
  {

    route: "/authentication/sign-in",
    component: !getIsAuthenticated() ? <SignIn /> : <Navigate to="/dashboard" />,
  },
];

export default routes;
