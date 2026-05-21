import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isOpenNow(hours: { day: string; open: string; close: string }[]): { open: boolean; closesAt?: string } {
  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = dayNames[now.getDay()];
  const todayHours = hours.find((h) => h.day === today);
  if (!todayHours) return { open: false };
  const [oh, om] = todayHours.open.split(":").map(Number);
  const [ch, cm] = todayHours.close.split(":").map(Number);
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  if (nowMin >= openMin && nowMin < closeMin) {
    const h12 = ch > 12 ? ch - 12 : ch;
    const ampm = ch >= 12 ? "PM" : "AM";
    return { open: true, closesAt: `${h12}:${cm.toString().padStart(2, "0")} ${ampm}` };
  }
  return { open: false };
}
