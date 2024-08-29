import { useState, RefObject } from "react";
import { Box, Divider } from "@mui/material";
import { useScroll } from "../hooks/use-scroll";

interface ScrollProgressProps {
  scrollRef?: RefObject<HTMLElement>;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  scrollRef,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useScroll(scrollRef, {
    debounce: 10,
    onScroll: setScrollPosition,
  });

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0,
          border: `${
            Math.floor(scrollPosition * 100) ? 1 : 0
          }px solid transparent`,
          borderColor: (theme) => theme.palette.primary[theme.palette.mode],
          width: `${scrollPosition * 100}%`,
        }}
      ></Box>
      <Divider />
    </Box>
  );
};
