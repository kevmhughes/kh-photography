import { useEffect, useState } from "react";

export function useResponsiveRowHeight() {
  const [targetRowHeight, setTargetRowHeight] = useState(450);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width <= 768) {
        // mobile
        setTargetRowHeight(700);
      } else if (width <= 1024) {
        // tablet
        setTargetRowHeight(500);
      } else if (width <= 1920) {
        // desktop
        setTargetRowHeight(450);
      } else {
        setTargetRowHeight(900);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return targetRowHeight;
}
