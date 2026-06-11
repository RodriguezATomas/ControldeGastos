export type ToastType = "success" | "error";

export type ToastPayload = {
  message: string;
  type: ToastType;
};

export const notify = (message: string, type: ToastType = "success") => {
  window.dispatchEvent(new CustomEvent<ToastPayload>("app:toast", { detail: { message, type } }));
};
