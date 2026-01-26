import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };

    // Immediate
    handleScroll();

    // Small delay to catch dynamic content loading
    const t = setTimeout(handleScroll, 100);

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
