import { MessageWithAuthor } from "@/@types";
import { useCallback, useEffect, useRef } from "react";

interface ScrollObserverProps {
  listTopRef: React.RefObject<HTMLDivElement>;
  listEndRef: React.RefObject<HTMLDivElement>;
  targetRef: React.RefObject<HTMLDivElement>;
  onScrollTopIntersect: () => void;
  onScrollBottomIntersect: () => void;
}

export const useListScrollObserver = ({
  listTopRef,
  listEndRef,
  targetRef,
  onScrollTopIntersect,
  onScrollBottomIntersect,
}: ScrollObserverProps) => {
  const observerTop = useRef<IntersectionObserver | null>(null);
  const observerBottom = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === listTopRef.current) {
            onScrollTopIntersect();
          }
          if (entry.target === listEndRef.current) {
            onScrollBottomIntersect();
          }
        }
      });
    },
    [onScrollTopIntersect, onScrollBottomIntersect, listTopRef, listEndRef]
  );

  useEffect(() => {
    const targetElement = targetRef.current;

    if (!targetElement) return;

    observerTop.current = new IntersectionObserver(handleObserver, {
      root: targetElement,
      threshold: 0,
    });

    observerBottom.current = new IntersectionObserver(handleObserver, {
      root: targetElement,
      threshold: 0,
    });

    if (listTopRef.current) {
      observerTop.current.observe(listTopRef.current);
    }
    if (listEndRef.current) {
      observerBottom.current.observe(listEndRef.current);
    }

    return () => {
      observerTop.current?.disconnect();
      observerBottom.current?.disconnect();
    };
  }, [listTopRef, listEndRef, targetRef, handleObserver]);
};
