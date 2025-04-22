export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
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


