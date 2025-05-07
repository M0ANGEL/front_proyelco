/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { API_KEY } from "@/config/api";
import { useEffect, useState } from "react";

const useSingleTab = (identifier = API_KEY) => {
  const [isSingleTab, setIsSingleTab] = useState(true);
  const [isPrimaryTab, setIsPrimaryTab] = useState(false);
  const channel = new BroadcastChannel(identifier);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isPrimaryTab) {
        channel.postMessage({ type: "PRIMARY" });
      }
    };

    const handleMessage = (event: any) => {
      if (event.data.type === "CHECK") {
        if (isPrimaryTab) {
          channel.postMessage({ type: "EXISTING" });
        }
      } else if (event.data.type === "EXISTING") {
        setIsSingleTab(false);
        setIsPrimaryTab(false);
      } else if (event.data.type === "PRIMARY") {
        // Update primary tab status if it's a different tab
        setIsSingleTab(true);
        setIsPrimaryTab(true);
      }
    };

    const checkIfAppIsActive = () => {
      channel.postMessage({ type: "CHECK" });
    };

    const handleUnload = () => {
      if (isPrimaryTab) {
        channel.postMessage({ type: "CHECK" });
      }
    };

    // Initialize tab status
    setIsPrimaryTab(true);
    checkIfAppIsActive();

    channel.addEventListener("message", handleMessage);
    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      channel.removeEventListener("message", handleMessage);
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      channel.close();
    };
  }, [identifier, isPrimaryTab]);

  return isSingleTab;
};

export default useSingleTab;
