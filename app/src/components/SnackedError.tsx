import { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackedErrorProps {
  error: Error | undefined;
  duration?: number;
}

export const SnackedError: React.FC<SnackedErrorProps> = ({
  error,
  duration = 1500,
}) => {
  const [open, setOpen] = useState(!!error);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    setOpen(!!error);
  }, [error]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error?.message}
      </Alert>
    </Snackbar>
  );
};
