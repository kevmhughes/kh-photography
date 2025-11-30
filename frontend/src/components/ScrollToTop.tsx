import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // scroll to top on route change
    // Reset body styles in case menu was left open
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  }, [pathname]);

  return null;
};

export default ScrollToTop;
