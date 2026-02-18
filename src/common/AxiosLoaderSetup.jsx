import { useEffect } from "react";
import { useLoader } from "./Loader";
import { setupAxiosInterceptors } from "../api/axios";

export default function AxiosLoaderSetup() {
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    setupAxiosInterceptors(showLoader, hideLoader);
  }, []);

  return null;
}
