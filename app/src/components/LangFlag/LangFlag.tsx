import { Box } from "@mui/material";
import { SxProps } from "@mui/system";
import { translate } from "./flags";

interface LangFlagProps {
  lang: string;
  size?: number;
  sx?: SxProps;
}

export const LangFlag: React.FC<LangFlagProps> = ({
  size,
  lang,
  sx,
  ...props
}) => {
  return (
    <Box
      {...props}
      className={`fi fi-${translate(lang)}`}
      sx={{
        ...sx,
        ...(size ? { width: size * 1.333333, height: size } : null),
      }}
    ></Box>
  );
};
