import { createContext, useState, ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { themeLight } from "./theme-light";
import { themeDark } from "./theme-dark";
import { useLocalStorage } from "../../hooks/use-local-storage";

type ThemeName = "light" | "dark";

export interface MUIContextProps {
  setTheme: (theme: ThemeName) => void;
  currentTheme: ThemeName;
}

interface MuiProviderProps {
  children: ReactNode;
}

const themes = {
  light: themeLight,
  dark: themeDark,
};

// const getSystemTheme = (): ThemeName => {
//   return window.matchMedia &&
//     window.matchMedia("(prefers-color-scheme: dark)").matches
//     ? "dark"
//     : "light";
// };

export const MUIContext = createContext<MUIContextProps | undefined>(undefined);

export const MuiProvider: React.FC<MuiProviderProps> = ({ children }) => {
  const { getItem, setItem } = useLocalStorage();
  const [currentTheme, setCurrentTheme] = useState(
    getItem("theme", "light") as ThemeName
  );

  const setTheme = (theme: ThemeName) => {
    setItem("theme", theme);
    setCurrentTheme(theme);
  };

  return (
    <MUIContext.Provider value={{ currentTheme, setTheme }}>
      <ThemeProvider theme={themes[currentTheme]}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MUIContext.Provider>
  );
};
