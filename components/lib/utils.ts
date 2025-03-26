import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumberWithCommas(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getTimestampDaysFromNow(days: number) {
  return Math.floor(Date.now() / 1000) + days * 86400;
}

export function parseQueryString(queryString: string) {
  let params = new URLSearchParams(queryString);
  let result: any = {};

  for (let [key, value] of params.entries()) {
    try {
      result[key] = decodeURIComponent(value);
      // Attempt to parse JSON if the value is a valid JSON string
      if (result[key].startsWith('{') && result[key].endsWith('}')) {
        result[key] = JSON.parse(result[key]);
      }
    } catch (e) {
      console.error(`Error parsing key ${key}:`, e);
    }
  }

  return result;
}