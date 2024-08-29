import { RouteObject, useRoutes } from "react-router-dom";
import { HomeScreen } from "./screens/HomeScreen";
import { QRCode } from "./screens/QRCode";

const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/qr",
    element: <QRCode />,
  },
];

export const Routes = () => useRoutes(routesConfig);
