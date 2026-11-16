import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const checkIsArray = (data: any) => {
  return Array.isArray(data);
};

const formatMsg = (item: any): string => {
  if (typeof item === "string") return item;
  if (item?.message) return String(item.message);
  try {
    return JSON.stringify(item);
  } catch {
    return String(item);
  }
};

const successMsg = (data: any) => {
  if (checkIsArray(data)) {
    data.forEach((m: any) => toast.success(formatMsg(m)));
  } else {
    toast.success(formatMsg(data));
  }
};

const errorMsg = (data: any) => {
  if (checkIsArray(data)) {
    data.forEach((m: any) => toast.error(formatMsg(m)));
  } else {
    toast.error(formatMsg(data));
  }
};

const defaultMsg = (data: any) => {
  if (checkIsArray(data)) {
    data.forEach((m: any) => toast(formatMsg(m)));
  } else {
    toast(formatMsg(data));
  }
};

export const showToast = (message: any, type = "default") => {
  switch (type) {
    case "success":
      successMsg(message);
      break;
    case "error":
      errorMsg(message);
      break;
    default:
      defaultMsg(message);
      break;
  }
};

export default function Notify() {
  return <ToastContainer autoClose={2000} />;
}
