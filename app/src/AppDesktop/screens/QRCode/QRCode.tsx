import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Container, Typography, Box, Slider } from "@mui/material";
import { QRCode as QRCodeComponent } from "react-qrcode-logo";

interface FormValues {
  text: string;
  size: number;
}

export const QRCode: React.FC = () => {
  const { control, watch } = useForm<FormValues>({
    defaultValues: { text: "https://marcopeg.com", size: 150 },
  });

  // Watch the `text` field value to regenerate QR code on change
  const qrCodeValue = watch("text");
  const qrCodeSize = watch("size");

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        QR Code Generator
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Enter text to generate a QR code"
              variant="outlined"
              fullWidth
              multiline
              maxRows={4}
            />
          )}
        />
      </Box>
      {qrCodeValue && (
        <Box>
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <Slider
                {...field}
                min={50}
                max={1200}
                step={10}
                valueLabelDisplay="auto"
              />
            )}
          />
          <QRCodeComponent value={qrCodeValue} size={qrCodeSize} />
        </Box>
      )}
    </Container>
  );
};
