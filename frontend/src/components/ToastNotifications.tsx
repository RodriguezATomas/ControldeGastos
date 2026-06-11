import { useEffect, useState } from "react";
import { ToastPayload } from "../utils/toast";

export const ToastNotifications = () => {
  const [toast, setToast] = useState<ToastPayload | null>(null);

  useEffect(() => {
    const handleToast = (event: Event) => {
      setToast((event as CustomEvent<ToastPayload>).detail);
    };

    window.addEventListener("app:toast", handleToast);
    return () => window.removeEventListener("app:toast", handleToast);
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  if (!toast) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 rounded-md px-4 py-3 text-sm font-medium text-white ${
        toast.type === "success" ? "bg-slate-900" : "bg-red-600"
      }`}
    >
      {toast.message}
    </div>
  );
};
