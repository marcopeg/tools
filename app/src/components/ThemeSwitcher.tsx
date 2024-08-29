import React from "react";
import { Box, IconButton, Icon } from "@mui/material";
import { useMUITheme } from "../hooks/use-mui-theme";

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useMUITheme();
  const darkMode = currentTheme === "dark";

  const switchTheme = () => setTheme(darkMode ? "light" : "dark");

  return (
    <Box display="flex" alignItems="center">
      <IconButton
        aria-label="toggle light/dark theme"
        onClick={switchTheme}
        color="inherit"
      >
        {darkMode ? (
          <Icon children={"brightness_7"} />
        ) : (
          <Icon children={"brightness_4"} />
        )}
      </IconButton>
    </Box>
  );
};
