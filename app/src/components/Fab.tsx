import { Fab as MUIFab, FabProps as MUIFabProps, Icon } from "@mui/material";
import { isFullScreen } from "../hooks/is-fullscreen";

interface FabProps {
  icon?: string;
  children?: React.ReactNode;
  color?: MUIFabProps["color"];
  onClick: () => void;
}

export const Fab: React.FC<FabProps> = ({
  children = null,
  icon,
  color = "primary",
  onClick,
  ...props
}) => (
  <MUIFab
    {...props}
    color={color}
    onClick={onClick}
    sx={{
      position: "absolute",
      bottom: isFullScreen() ? 90 : 70,
      right: 16,
      width: "auto",
      height: 56,
      padding: "0 24px",
      borderRadius: "28px",
      whiteSpace: "nowrap",
      fontSize: "16px",
    }}
  >
    {icon && <Icon>{icon}</Icon>}
    {children}
  </MUIFab>
);
