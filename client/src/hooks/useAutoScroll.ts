import { delay } from "@/utils/delay";
import { useEffect, useRef, RefObject } from "react";

const useAutoScroll = <T extends HTMLElement>(): {
  endRef: RefObject<T>;
  scrollToBottom: () => void;
} => {
  const endRef = useRef<T>(null);

  const scrollToBottom = async () => {
    await delay(100);
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return { endRef, scrollToBottom };
};

export default useAutoScroll;
