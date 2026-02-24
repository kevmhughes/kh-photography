import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Make sure browser doesn't auto restore scroll
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Use a small timeout to let the browser paint first
    const timeout = setTimeout(() => {
      const root = document.querySelector("#root") || document.documentElement;

      // Reset all possible scroll positions
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      root.scrollTo?.(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 50); 

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;