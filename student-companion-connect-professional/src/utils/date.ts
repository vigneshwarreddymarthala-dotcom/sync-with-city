import { format } from "date-fns";

export function safeFormat(dateVal: any, pattern: string = "EEE, do MMM"): string {
  if (!dateVal) return "";
  try {
    const d = typeof dateVal === "string" || typeof dateVal === "number" ? new Date(dateVal) : dateVal;
    if (d instanceof Date && !isNaN(d.getTime())) {
      return format(d, pattern);
    }
    if (typeof dateVal === "string") {
      const parts = dateVal.split("-");
      if (parts.length === 3) {
        const d2 = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
        if (!isNaN(d2.getTime())) return format(d2, pattern);
      }
      return dateVal;
    }
    return String(dateVal);
  } catch {
    return String(dateVal || "");
  }
}
