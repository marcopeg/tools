import { useLocation, Link } from "react-router-dom";
import { Button, Icon, IconButton } from "@mui/material";

interface MenuItemBaseProps {
  to: string;
}

interface MenuItemWithLabel extends MenuItemBaseProps {
  label: string;
  icon?: string;
}

interface MenuItemWithIcon extends MenuItemBaseProps {
  icon: string;
  label?: string;
}

type MenuItemProps = MenuItemWithLabel | MenuItemWithIcon;

export const MenuItem: React.FC<MenuItemProps> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname.includes(to);

  return label ? (
    <Button
      to={to}
      component={Link}
      startIcon={icon && <Icon>{icon}</Icon>}
      variant={isActive ? "outlined" : "text"}
    >
      {label || null}
    </Button>
  ) : (
    <IconButton to={to} component={Link}>
      <Icon color={"primary"}>{icon}</Icon>
    </IconButton>
  );
};
