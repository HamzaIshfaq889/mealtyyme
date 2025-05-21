import { SubscriptionStatus } from "@/lib/types/subscription";

export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function capitalizeFirstLetter(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const truncateChars = (text: string, charLimit: number): string => {
  if (!text) return "";
  if (text.length <= charLimit) return text;

  return text.slice(0, charLimit).trimEnd() + "...";
};

export const convertMinutesToTimeLabel = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hoursLabel = hours > 0 ? `${hours}h` : "";
  const minutesLabel = minutes > 0 ? `${minutes}m` : "";

  return `${hoursLabel} ${minutesLabel}`.trim();
};

export function humanizeMinuteSecond(input: string): string {
  const [minStr, secStr = "0"] = input.split(":");
  let minutes = parseInt(minStr, 10) || 0;
  const seconds = parseInt(secStr, 10) || 0;
  const hours = Math.floor(minutes / 60);
  minutes = minutes % 60;

  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}min`);
  if (!hours && !minutes && seconds) {
    parts.push(`${seconds}s`);
  } else if (seconds) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ") || "0s";
}

export const formatDateToYYYYMMDD = (dateString: string): string => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getGreeting = (name: string) => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return `Good Morning ${name ? name : ""}`;
  } else if (currentHour < 18) {
    return `Good Afternoon ${name ? name : ""}`;
  } else {
    return `Good Evening ${name ? name : ""}`;
  }
};

export const getIconName = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "sunny-outline";
  } else if (currentHour < 18) {
    return "partly-sunny-outline";
  } else {
    return "moon-outline";
  }
};

export const ReviewButtons = [
  "Easy and tasty",
  "A bit bland",
  "Flexitarian",
  "Paleo",
  "Vegetarian",
  "Pescatarian",
  "Vegan",
];

export function getCleanDescription(raw: string): string {
  // Remove HTML tags
  const plainText = raw.replace(/<[^>]*>/g, "");

  // Find the index of the second period
  let periodCount = 0;
  let endIndex = plainText.length;

  for (let i = 0; i < plainText.length; i++) {
    if (plainText[i] === ".") {
      periodCount++;
      if (periodCount === 2) {
        endIndex = i + 1;
        break;
      }
    }
  }

  return plainText.slice(0, endIndex).trim();
}

export const checkisProUser = (status: SubscriptionStatus): boolean => {
  return status === "active" || status === "past_due";
};

export const checkisSubscriptionCanceled = (
  status: SubscriptionStatus
): boolean => {
  return status === "canceled";
};

export const supportOptions = [
  "Technical Issue",
  "Account Help",
  "Billing Questions",
  "Feedback/Suggestions",
  "Others",
];

export const PackagesPrice = {
  month: 4.0,
  year: 99.0,
};

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getNextBillingDate = (
  startDate: string,
  interval: "month" | "year"
): string => {
  const date = new Date(startDate);

  if (interval === "month") {
    date.setMonth(date.getMonth() + 1);
  } else if (interval === "year") {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    throw new Error('Invalid interval. Must be "month" or "year".');
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatUnixTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatUtcDateString = (dateString: string): string => {
  const isoFormatted = dateString.replace(" ", "T").replace(" UTC", "Z");
  const date = new Date(isoFormatted);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const convertToFraction = (decimal: number): string => {
  // Handle very small numbers (less than 1)
  if (decimal < 1 && decimal > 0) {
    return "1/4";
  }

  // Get the whole number part
  const whole = Math.floor(decimal);
  const fraction = decimal - whole;

  // If there's no fraction, just return the whole number
  if (fraction === 0) return whole.toString();

  // Define our target fractions and their decimal values
  const fractions = [
    { decimal: 0.25, text: "1/4" },
    { decimal: 0.5, text: "1/2" },
    { decimal: 0.75, text: "3/4" },
    { decimal: 0.33, text: "1/3" },
    { decimal: 0.67, text: "2/3" },
  ];

  // Find the closest fraction
  let closestFraction = fractions[0];
  let smallestDiff = Math.abs(fraction - fractions[0].decimal);

  for (const frac of fractions) {
    const diff = Math.abs(fraction - frac.decimal);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestFraction = frac;
    }
  }

  // If the difference is too large, round to the nearest fraction
  if (smallestDiff > 0.1) {
    return Math.round(decimal).toString();
  }

  // Return the formatted result
  return whole > 0 ? `${whole} ${closestFraction.text}` : closestFraction.text;
};
