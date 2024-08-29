/**
 * Redirects to a specified path when the dependencies change.
 * (used to reset navigation when switching between mobile and desktop UI)
 */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const useRedirectOnChange = (to: string = "/", dependencies: any[]) => {
  const navigate = useNavigate();
  const dependenciesRef = useRef<any[] | null>(null);

  useEffect(() => {
    if (dependenciesRef.current === null) {
      dependenciesRef.current = dependencies;
      return;
    }

    if (dependenciesRef.current !== dependencies) {
      navigate(to);
    }
  }, dependencies);
};
