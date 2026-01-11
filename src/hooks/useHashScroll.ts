import { useEffect } from "react";

export function useHashScroll(offset = 0) {
  const scrollToHash = () => {
    const hash = window.location.hash;
    if (!hash) return;

    const el = document.querySelector(hash);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // initial load
    scrollToHash();

    // listen for hash clicks (even same hash)
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [offset]);
  return scrollToHash;
}
