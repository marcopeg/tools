import React from "react";
import { Container, Box, Typography } from "@mui/material";

export const HomeScreen: React.FC = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "30vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Typography
          variant="h2"
          align="center"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Welcome to TOOLS
        </Typography>
        <Typography variant="body1" align="center" mt={2}>
          Here you can find a collection of tools to help you with your daily
          struggle as a developer.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomeScreen;
