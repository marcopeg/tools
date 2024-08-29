import { honorifics } from "./honorifics";
import { charsMap } from "./chars";

const reversecharsMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(charsMap).map(([original, placeholder]) => [
    placeholder,
    original,
  ])
);

export const processText = (source: string): string => {
  // Step 1: Replace special characters with placeholder sequences
  const step1 = Object.keys(charsMap).reduce((text, char) => {
    const placeholder = charsMap[char];
    const regex = new RegExp(char, "g");
    return text.replace(regex, placeholder);
  }, source);

  // Replace spaces after honorifics with a placeholder
  const honorificPlaceholder = "x7468fh3";
  const honorificPattern = new RegExp(
    `\\b(${honorifics.join("|")})\\.\\s+`,
    "gi"
  );

  const step2 = step1.replace(honorificPattern, (match) =>
    match.replace(/\s+/, honorificPlaceholder)
  );

  // Step 2: Apply the original text processing logic
  const step3 = step2
    .replace(/\n\n/g, "\n\nx123x321x\n\n")
    .replace(/([.!?])(?=\s|\n)(?!\s*\d+\.)/g, (match, p1, offset, string) => {
      const lastLineBreak = string.lastIndexOf("\n", offset);
      const lineStart = string.slice(lastLineBreak + 1, offset + 2).trim();

      const isInTitle = lineStart.startsWith("#");
      const isOrderedList = /^\d+\.\s/.test(lineStart);

      if (isInTitle || isOrderedList) return match;

      return `${p1}\n\n`;
    });

  // Step 3: Replace placeholder sequences back to original special characters
  const step4 = Object.keys(reversecharsMap).reduce((text, placeholder) => {
    const originalChar = reversecharsMap[placeholder];
    const regex = new RegExp(placeholder, "g");
    return text.replace(regex, originalChar);
  }, step3);

  // Replace the placeholder back to a space
  return step4.replace(new RegExp(honorificPlaceholder, "g"), " ");
};
