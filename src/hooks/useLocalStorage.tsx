import { useEffect, useState } from "react";

function useLocalStorage<T>({
  key,
  initialValue,
  reviver,
}: {
  key: string;
  initialValue: T;
  reviver?: (value: any) => T;
}): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredvalue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : initialValue;
      return reviver ? reviver(parsed) : parsed;
    } catch (err) {
      console.log(err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.log(err);
    }
  }, [storedValue, key]);

  return [storedValue, setStoredvalue];
}

export default useLocalStorage;
