import { useRef, useEffect, useCallback } from "react";

interface UseScrollOptions {
  debounce?: number;
  precision?: number;
  onScroll?: (scrollPosition: number) => void;
}

export type UseScrollRef = React.RefObject<HTMLElement> | "window";

export const useScroll = (
  targetRef: UseScrollRef = "window",
  { debounce = 250, precision = 0.001, onScroll }: UseScrollOptions = {}
) => {
  const debounceRef = useRef<number | null>(null);
  const positionRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    let newValue = 0;
    if (targetRef === "window") {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      newValue = scrollTop / (scrollHeight - clientHeight);
    } else if (targetRef?.current) {
      const scrollTop = targetRef.current.scrollTop;
      const scrollHeight = targetRef.current.scrollHeight;
      const clientHeight = targetRef.current.clientHeight;
      newValue = scrollTop / (scrollHeight - clientHeight);
    }

    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (Math.abs(newValue - positionRef.current) > precision) {
        positionRef.current = newValue;
        onScroll && onScroll(newValue);
      }
    }, debounce);
  }, []);

  useEffect(() => {
    if (targetRef === "window") {
      window.addEventListener("scroll", handleScroll);
    } else if (targetRef.current !== null) {
      targetRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (targetRef === "window") {
        window.removeEventListener("scroll", handleScroll);
      } else if (targetRef.current !== null) {
        targetRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [targetRef === "window" ? null : targetRef.current]);
};
