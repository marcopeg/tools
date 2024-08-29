import { Link } from "react-router-dom";
import { AppBar, Toolbar, Stack, Typography } from "@mui/material";

import { MenuItem } from "./components/MenuItem";

export const TopBar: React.FC = () => {
  return (
    <>
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          color: (theme) =>
            theme.palette.getContrastText(theme.palette.background.default),
        }}
      >
        <Toolbar>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            spacing={2}
            sx={{ flex: 1 }}
          >
            <Stack
              direction={"row"}
              alignItems={"flex-end"}
              flex={1}
              to="/"
              component={Link}
              sx={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Typography variant="h3">tools</Typography>
              <Typography variant="caption">.marcopeg.com</Typography>
            </Stack>
            <MenuItem to={"qr"} icon={"qr_code"} label="qr" />
            <MenuItem to={"json"} icon={"data_object"} label={"json"} />
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};
