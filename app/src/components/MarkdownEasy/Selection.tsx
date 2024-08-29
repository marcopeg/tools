import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { Box } from "@mui/material";

const TRANSLATE_QUERY = gql`
  mutation translate($from: String!, $text: String!, $to: String!) {
    translate(from: $from, text: $text, to: $to, skipLog: false) {
      translation {
        value
      }
      cost
    }
  }
`;

const noop = () => {};

interface SelectionProps {
  from: string;
  to: string;
}

export const Selection: React.FC<SelectionProps> = ({ from, to }) => {
  const [selection, setSelection] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    content: string;
  } | null>(null);

  const [translate, { loading, data, error }] = useMutation(TRANSLATE_QUERY, {
    variables: {
      from,
      to,
    },
    refetchQueries: ["getTranslationsHistory"],
    onError: noop,
  });

  const handleTextSelection = () => {
    const selectedText = window.getSelection()?.toString();

    if (selectedText && window.getSelection()?.rangeCount) {
      const range = window.getSelection()?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        translate({
          variables: {
            text: selectedText.toLowerCase(),
          },
        }).catch(noop);

        setSelection({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          content: selectedText,
        });
      }
    } else {
      setSelection(null);
    }
  };

  useEffect(() => {
    let _debouncer: number | undefined;
    const debouncedSelectionHandler = () => {
      setSelection(null);
      clearTimeout(_debouncer);
      _debouncer = setTimeout(() => {
        handleTextSelection();
      }, 500);
    };

    document.addEventListener("selectionchange", debouncedSelectionHandler);
    return () => {
      document.removeEventListener(
        "selectionchange",
        debouncedSelectionHandler
      );
    };
  }, []);

  if (!selection) return;

  return (
    <Box
      sx={{
        position: "fixed",
        top: selection.top,
        left: selection.left,
        background: "yellow",
        padding: 2,
      }}
    >
      {loading ? "..." : error ? "error" : data?.translate.translation.value}
    </Box>
  );
};
