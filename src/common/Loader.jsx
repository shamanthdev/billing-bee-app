import { createContext, useContext, useState } from "react";
import LoadingOverlay from "./LoadingOverlay";

const LoaderContext = createContext();

export function LoaderProvider({ children }) {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoader = () =>
    setLoadingCount((count) => count + 1);

  const hideLoader = () =>
    setLoadingCount((count) => Math.max(0, count - 1));

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}

      {/* Global Loader */}
      <LoadingOverlay
        show={loadingCount > 0}
        text="Loading..."
      />
    </LoaderContext.Provider>
  );
}

export const useLoader = () =>
  useContext(LoaderContext);
