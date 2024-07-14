// useToast.js

import { useToastStore } from "@/store/toastStore";

const useToast = () => {
  const showToast = useToastStore((state) => state.showToast);
  const removeToast = useToastStore((state) => state.removeToast);

  return {
    showToast,
    removeToast,
  };
};

export default useToast;
