import { useState } from "react";

export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const localVal = window.localStorage.getItem(key);
      return localVal ? JSON.parse(localVal) : defaultValue;
    } catch (error) {
      console.error(error);
      return defaultValue;
    }
  });

  const setLocalStorage = (newValue) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) { console.error(error); }
  };

  return [value, setLocalStorage];
}