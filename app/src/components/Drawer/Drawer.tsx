import {
  useState,
  useImperativeHandle,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  ReactNode,
  MouseEvent,
  RefObject,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer as MUIDrawer,
  Box,
  Stack,
  DialogTitle,
  DialogContent,
  DialogActions,
  SxProps,
  Theme,
} from "@mui/material";
import { isFullScreen, IOS_SPACING_BOTTOM } from "../../hooks/is-fullscreen";
import { ScrollProgress } from "../ScrollProgress";

interface DrawerProps {
  children: ReactNode;
  title: string;
  content?: ReactNode;
  actions?: ReactNode;
  param?: string;
  fullScreen?: boolean;
  scrollable?: boolean;
  dialogTitleSX?: SxProps<Theme>;
  dialogContentSX?: SxProps<Theme>;
  dialogActionsSX?: SxProps<Theme>;
  [key: string]: any; // To allow other props to be passed
}

type OtherParams = {
  [key: string]: string | null;
};

type OpenWithParam = (options?: {
  paramName?: string;
  paramValue?: string;
  otherParams?: OtherParams;
}) => void;

type CloseWithParam = (options?: {
  paramName?: string;
  otherParams?: string[];
}) => void;

type GetParamValue = (param: string) => string;
type SetParamValue = (param: string, value: string | number) => void;
export interface DrawerHandlerProps {
  open: () => void;
  close: () => void;
}

export interface UseDrawerProps {
  paramValue: string | null;
  openWithParam: OpenWithParam;
  closeWithParam: CloseWithParam;
  getParamValue: GetParamValue;
  setParamValue: SetParamValue;
}

export interface DrawerApis {
  open: () => void;
  close: () => void;
}

export const useDrawer = (param?: string): UseDrawerProps => {
  const location = useLocation();
  const navigate = useNavigate();

  const getParamValue: GetParamValue = useCallback(
    (param) => {
      const searchParams = new URLSearchParams(location.search);
      const paramValue = searchParams.get(param);
      return paramValue ? decodeURIComponent(paramValue) : "";
    },
    [param, location]
  );

  const setParamValue: SetParamValue = useCallback(
    (param, value) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set(param, encodeURIComponent(value));
      navigate({ search: searchParams.toString() });
    },
    [location]
  );

  const openWithParam: OpenWithParam = useCallback(
    ({ paramName = param, paramValue = "true", otherParams = {} } = {}) => {
      if (paramName) {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(paramName, encodeURIComponent(paramValue));

        for (const [key, value] of Object.entries(otherParams)) {
          if (value === null) {
            searchParams.delete(key);
          } else {
            searchParams.set(key, value);
          }
        }

        navigate({ search: searchParams.toString() });
      }
    },
    [param, location]
  );

  const closeWithParam: CloseWithParam = useCallback(
    ({ paramName = param, otherParams = [] } = {}) => {
      if (paramName) {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete(paramName);
        for (const key of otherParams) {
          searchParams.delete(key);
        }

        navigate({ search: searchParams.toString() }, { replace: true });
      }
    },
    [param, location]
  );

  return {
    paramValue: param ? getParamValue(param) : null,
    getParamValue,
    setParamValue,
    openWithParam,
    closeWithParam,
  };
};

export interface ActionsProps {
  children: ReactNode;
  scrollRef?: RefObject<HTMLElement>;
  dialogActionsSX?: SxProps<Theme>;
}

const Actions: React.FC<ActionsProps> = ({
  children,
  scrollRef,
  dialogActionsSX = {},
}) => {
  const actions =
    Array.isArray(children) && children.length > 1 ? (
      <DialogActions sx={dialogActionsSX}>
        <Stack flexGrow={1}>{children}</Stack>
      </DialogActions>
    ) : (
      <DialogActions sx={dialogActionsSX}>{children}</DialogActions>
    );

  return (
    <>
      {scrollRef && <ScrollProgress scrollRef={scrollRef} />}
      {actions}
    </>
  );
};

export const Drawer = forwardRef<DrawerHandlerProps, DrawerProps>(
  (
    {
      param,
      title,
      content,
      children,
      actions,
      fullScreen,
      scrollable,
      dialogTitleSX = {},
      dialogContentSX = {},
      dialogActionsSX = {},
      ...props
    },
    ref
  ) => {
    const location = useLocation();
    const standalone = isFullScreen();
    const { openWithParam, closeWithParam } = useDrawer(param);
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (param) {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has(param)) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      }
    }, [location]);

    const open = useCallback(() => {
      if (param) {
        openWithParam();
      } else {
        setIsOpen(true);
      }
    }, [location]);

    const close = useCallback(() => {
      if (param) {
        closeWithParam();
      } else {
        setIsOpen(false);
      }
    }, [location]);

    // Expose open function to parent via ref
    useImperativeHandle(ref, (): DrawerApis => ({ open, close }));

    const body = content || children;

    return (
      <MUIDrawer
        anchor="bottom"
        open={isOpen}
        onClose={close}
        PaperProps={{
          sx: {
            ...(fullScreen && { width: "100%", height: "100%" }),
            ...(standalone && { paddingBottom: IOS_SPACING_BOTTOM }),
          },
        }}
        {...props}
      >
        {title && <DialogTitle sx={dialogTitleSX}>{title}</DialogTitle>}
        {title && scrollable && <ScrollProgress scrollRef={scrollRef} />}
        {body && (
          <DialogContent ref={scrollRef} sx={dialogContentSX}>
            {body}
          </DialogContent>
        )}
        {actions && (
          <Actions
            children={actions}
            scrollRef={title ? undefined : scrollable ? scrollRef : undefined}
            dialogActionsSX={dialogActionsSX}
          />
        )}
      </MUIDrawer>
    );
  }
);

export const DrawerSection = ({ sx = {}, ...props }) => (
  <Box {...props} sx={{ padding: "10px", ...sx }} />
);

export const openDrawer = (ref: RefObject<DrawerHandlerProps>) => ({
  onClick: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    if (ref.current) {
      ref.current.open();
    }
  },
});
