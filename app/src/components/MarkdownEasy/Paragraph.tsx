import React, { useState, useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  Divider,
  Box,
  Stack,
  Typography,
  Icon,
  IconButton,
} from "@mui/material";
import { Theme, lighten } from "@mui/material/styles";

const TRANSLATE_QUERY = gql`
  mutation translate($from: String!, $text: String!, $to: String!) {
    translate(from: $from, text: $text, to: $to, skipLog: true) {
      translation {
        value
      }
      cost
    }
  }
`;

const noop = () => {};

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  from: string;
  to: string;
  variant:
    | "body1"
    | "body2"
    | "caption"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";
}

const extractText = (children: React.ReactNode): string => {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(extractText).join("");
  }

  if (React.isValidElement(children)) {
    return extractText(children.props.children);
  }

  return "";
};

interface ClickProps {
  poi: Date;
  x: number;
  y: number;
}

export const Paragraph: React.FC<ParagraphProps> = ({
  children,
  from,
  to,
  variant,
}) => {
  const clickRef = useRef<ClickProps>({ poi: new Date(), x: 0, y: 0 });
  const foobarRef = useRef<number>(0);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  const [translate, { loading, data, error }] = useMutation(TRANSLATE_QUERY, {
    variables: {
      from,
      to,
      text: extractText(children),
    },
    refetchQueries: ["getTranslationsHistory"],
    onError: noop,
  });

  const handleTranslate = () => {
    clearTimeout(foobarRef.current);
    foobarRef.current = setTimeout(() => {
      if (showTranslation) {
        setShowTranslation(false);
      } else {
        setShowTranslation(true);
        translate().catch(noop);
      }
    }, 150);
  };

  const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
    const point =
      e.type === "mousedown" || e.type === "mouseup"
        ? {
            x: (e as React.MouseEvent).clientX,
            y: (e as React.MouseEvent).clientY,
          }
        : {
            x: (e as React.TouchEvent).touches[0].clientX,
            y: (e as React.TouchEvent).touches[0].clientY,
          };

    clickRef.current = {
      poi: new Date(),
      x: point.x,
      y: point.y,
    };
  };

  const handleUp = (e: React.MouseEvent | React.TouchEvent) => {
    const deltaPoit: number =
      new Date().getTime() - clickRef.current.poi.getTime();

    let clientX: number;
    let clientY: number;

    if (e.type === "mouseup" || e.type === "mousedown") {
      // Handle MouseEvent
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    } else {
      // Handle TouchEvent
      clientX = (e as React.TouchEvent).changedTouches[0].clientX;
      clientY = (e as React.TouchEvent).changedTouches[0].clientY;
    }

    const deltaX = Math.abs(clientX - clickRef.current.x);
    const deltaY = Math.abs(clientY - clickRef.current.y);

    if (deltaPoit < 500 && deltaX < 10 && deltaY < 10) {
      handleTranslate();
    }
  };

  const sx = showTranslation
    ? {
        background: (theme: Theme) => lighten(theme.palette.success.light, 0.8),
        color: (theme: Theme) =>
          theme.palette.getContrastText(
            lighten(theme.palette.success.light, 0.8)
          ),
        borderTop: "1px solid black",
        borderTopColor: "#aaa",
        boxShadow: 2,
        mb: 2,
      }
    : {
        borderTop: "1px solid transparent",
        color: "inherit",
      };

  const translation = showTranslation ? (
    loading ? (
      "..."
    ) : error ? (
      <Typography
        variant="body2"
        sx={{ color: (theme) => theme.palette.error.main }}
      >
        {error.message}
      </Typography>
    ) : (
      <>
        <Divider
          sx={{
            width: "100vw",
            ml: -2,
            mr: -2,
            mt: 1,
            background: "white",
            borderColor: "white",
          }}
        />
        <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, pr: 2 }}>
          {data?.translate.translation.value}
        </Typography>
      </>
    )
  ) : (
    ""
  );

  // Visual separator:
  if (children === "x123x321x") {
    return <Box sx={{ mt: 4 }} />;
  }

  return (
    <Box
      sx={{
        p: 2,
        pb: 1,
        position: "relative",
        ...sx,
      }}
    >
      <Stack
        component={"div"}
        direction={"row"}
        spacing={2}
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        onMouseDown={handleDown}
        onMouseUp={handleUp}
        onTouchStart={handleDown}
        onTouchEnd={handleUp}
      >
        <Stack>
          <Typography variant={variant} sx={{ pr: 2 }}>
            {children}
          </Typography>
          {showTranslation && translation}
        </Stack>
      </Stack>
      {showTranslation && (
        <IconButton
          onClick={handleTranslate}
          size="small"
          sx={{
            position: "absolute",
            top: 1,
            right: 1,
            color: "#666",
          }}
        >
          <Icon>close</Icon>
        </IconButton>
      )}
    </Box>
  );
};
