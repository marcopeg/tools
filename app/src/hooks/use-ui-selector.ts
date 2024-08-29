/**
 * Used in the App.tsx to choose the root UI element to render
 */

import { useMediaQuery, useTheme } from "@mui/material";

export const useUISelector = (): "mobile" | "desktop" => {
  const theme = useTheme();

  // Check if the device is a touch device
  const isTouchDevice = useMediaQuery("(hover: none) and (pointer: coarse)");

  // Check if the screen size is small (mobile)
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return isTouchDevice || isMobileScreen ? "mobile" : "desktop";
};
