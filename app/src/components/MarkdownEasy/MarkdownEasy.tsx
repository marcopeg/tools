import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import { Box } from "@mui/material";
import { Paragraph } from "./Paragraph";
import { Selection } from "./Selection";
import { processText } from "./process-text";

interface MarkdownEasyProps {
  source: string;
  from: string;
  to: string;
}

export const MarkdownEasy: React.FC<MarkdownEasyProps> = ({
  source,
  ...langProps
}) => {
  const content = processText(source);

  const components: Components = {
    p: ({ node, ...props }) => (
      <Paragraph {...props} {...langProps} variant={"body1"} />
    ),
    // li: ({ node, ...props }) => (
    //   <Paragraph {...props} {...langProps} variant={"body1"} />
    // ),
    h1: ({ node, ...props }) => (
      <Paragraph {...props} {...langProps} variant={"h1"} />
    ),
    h2: ({ node, ...props }) => (
      <Paragraph {...props} {...langProps} variant={"h2"} />
    ),
    h3: ({ node, ...props }) => (
      <Paragraph {...props} {...langProps} variant={"h3"} />
    ),
    h4: ({ node, ...props }) => (
      <Paragraph {...props} {...langProps} variant={"h4"} />
    ),
    h5: ({ node, ...props }) => (
      <Paragraph {...props} {...langProps} variant={"h5"} />
    ),
    h6: ({ node, ...props }) => (
      <Paragraph {...props} {...langProps} variant={"h6"} />
    ),
  };

  return (
    <>
      <Box
        sx={{
          mt: 1,
          mb: 1,
        }}
      >
        <ReactMarkdown components={components}>{content}</ReactMarkdown>
      </Box>
      <Selection {...langProps} />
    </>
  );
};
