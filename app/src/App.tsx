import { useRedirectOnChange } from "./hooks/use-redirect-on-change";
import { useUISelector } from "./hooks/use-ui-selector";
import { AppMobile } from "./AppMobile";
import { AppDesktop } from "./AppDesktop";

export const App = () => {
  const ui = useUISelector();
  useRedirectOnChange("/", [ui]);
  return ui === "mobile" ? <AppMobile /> : <AppDesktop />;
};
