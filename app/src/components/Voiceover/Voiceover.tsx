import { useEffect, MouseEvent } from "react";
import { IconButton, IconButtonProps, Icon } from "@mui/material";

import { useVoiceOver } from "./use-voiceover";

interface VoiceoverProps extends IconButtonProps {
  text: string;
  lang: string;
  size?: "small" | "medium" | "large";
  autoplay?: boolean;
}

export const Voiceover: React.FC<VoiceoverProps> = ({
  text,
  lang,
  size = "medium",
  autoplay = false,
  ...props
}) => {
  const { isPlaying, isSupported, play, stop, reset } = useVoiceOver({ lang });

  const enqueueSnackbar = (...args: any[]) => {
    console.log("enqueueSnackbar", args);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Show info when not supported
    if (!isSupported) {
      enqueueSnackbar(`Language "${lang}" not supported`, { variant: "error" });
      return;
    }

    // Toggle play/stop when supported
    isPlaying ? stop() : play(text);
  };

  useEffect(() => {
    if (autoplay) {
      const timer = setTimeout(() => {
        reset();
        play(text);
      }, 0);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [text, autoplay, play, reset]);

  return (
    <IconButton {...props} onClick={handleClick} size={size}>
      {!isSupported ? (
        <Icon fontSize={size}>volume_off</Icon>
      ) : isPlaying ? (
        <Icon fontSize={size}>stop_circle_outlinedIcon</Icon>
      ) : (
        <Icon fontSize={size}>volume_up_outlined</Icon>
      )}
    </IconButton>
  );
};
