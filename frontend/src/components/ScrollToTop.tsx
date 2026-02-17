import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Prevent Safari restoring scroll
    window.history.scrollRestoration = "manual";

    // Remove any body locks from nav menus
    document.body.style.removeProperty("position");
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("width");
    document.body.style.removeProperty("overflow");

    // Scroll both window and root containers
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.querySelector("#root")?.scrollTo?.(0, 0);
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
