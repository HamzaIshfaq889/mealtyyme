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


