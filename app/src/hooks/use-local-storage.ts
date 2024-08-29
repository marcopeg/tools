import { useCallback, useMemo } from "react";

interface UseLocalStorageReturn {
  getItem: (
    key: string,
    defaultValue?: string | number | (() => string | number)
  ) => string | number | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clearAll: () => void;
}

export const useLocalStorage = (
  namespace: string = "babelify.v2"
): UseLocalStorageReturn => {
  const prefix = `${namespace}.`;
  const indexKey = `${namespace}_index`;

  // Helper function to update the index of keys
  const updateIndex = (key: string, add: boolean) => {
    const index = JSON.parse(
      localStorage.getItem(indexKey) || "[]"
    ) as string[];
    const updatedIndex = add
      ? Array.from(new Set([...index, key]))
      : index.filter((k) => k !== key);
    localStorage.setItem(indexKey, JSON.stringify(updatedIndex));
  };

  // Get a value from local storage, using a default value if it doesn't exist
  const getItem = useCallback(
    (
      key: string,
      defaultValue?: string | number | (() => string | number)
    ): string | number | null => {
      const fullKey = `${prefix}${key}`;
      const storedValue = localStorage.getItem(fullKey);
      if (storedValue !== null) {
        return storedValue;
      }
      if (typeof defaultValue === "function") {
        return defaultValue();
      }
      return defaultValue || null;
    },
    [prefix]
  );

  // Set a value in local storage
  const setItem = useCallback(
    (key: string, value: string) => {
      const fullKey = `${prefix}${key}`;
      localStorage.setItem(fullKey, value);
      updateIndex(key, true);
    },
    [prefix]
  );

  // Remove a value from local storage
  const removeItem = useCallback(
    (key: string) => {
      const fullKey = `${prefix}${key}`;
      localStorage.removeItem(fullKey);
      updateIndex(key, false);
    },
    [prefix]
  );

  // Clear all values in the namespace
  const clearAll = useCallback(() => {
    const index = JSON.parse(
      localStorage.getItem(indexKey) || "[]"
    ) as string[];
    index.forEach((key) => {
      localStorage.removeItem(`${prefix}${key}`);
    });
    localStorage.removeItem(indexKey);
  }, [prefix]);

  // Memoized return object
  return useMemo(
    () => ({
      getItem,
      setItem,
      removeItem,
      clearAll,
    }),
    [getItem, setItem, removeItem, clearAll]
  );
};
