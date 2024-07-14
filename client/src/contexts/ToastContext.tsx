import { useToastStore } from "@/store/toastStore";
import React, { useState, useEffect } from "react";

const ToastContext = ({ children }: { children: React.ReactNode }) => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  const [exitingToasts, setExitingToasts] = useState<string[]>([]);

  const getToastStyle = (type: "success" | "error" | "info" | "warning") => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-gray-800";
    }
  };

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!exitingToasts.includes(toast.id)) {
        setTimeout(() => {
          setExitingToasts((prev) => [...prev, toast.id]);
        }, toast.duration || 3000);
      }
    });
  }, [toasts, exitingToasts]);

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 space-y-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`text-white p-3 rounded-md shadow-md transform transition-all duration-500 ease-out ${
              exitingToasts.includes(toast.id)
                ? "animate-slide-out-right"
                : "animate-slide-in-right"
            } ${getToastStyle(toast.type)}`}
            onAnimationEnd={() => {
              if (exitingToasts.includes(toast.id)) {
                removeToast(toast.id);
                setExitingToasts((prev) =>
                  prev.filter((toastId) => toastId !== toast.id)
                );
              }
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
};

export default ToastContext;
