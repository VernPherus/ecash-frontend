/**
 * Formats a number into a currency string (e.g., "₱ 1,200.00")
 * Defaults to Philippine Peso (PHP) based on your location context.
 * * @param {number|string} amount - The amount to format
 * @param {string} currency - The currency code (default: "PHP")
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, currency = "PHP") => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "₱ 0.00";
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

/**
 * Formats a date string into a readable format (e.g., "Jan 22, 2026")
 * * @param {string|Date} date - The date to format
 * @param {boolean} includeTime - Whether to include the time (default: false)
 * @returns {string} The formatted date string
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return "-";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  };

  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};

/**
 * Formats a number into a compact string for tight spaces (e.g., "1.2M", "500k")
 * Great for dashboard cards.
 * * @param {number} number
 * @returns {string}
 */
export const formatCompactNumber = (number) => {
  if (!number) return "0";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(number);
};

/**
 * Formats a decimal into a percentage string (e.g., "85%")
 * * @param {number} value - The value (e.g., 0.85 or 85)
 * @param {boolean} isDecimal - If true, 0.85 becomes 85%. If false, 85 stays 85%.
 * @returns {string}
 */
export const formatPercentage = (value, isDecimal = false) => {
  if (value === null || value === undefined) return "0%";
  const number = isDecimal ? value : value / 100;

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(number);
};

/**
 * Truncates text if it exceeds a certain length
 */
export const truncateText = (text, maxLength = 20) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Formats relative time, used in notification
 * @param {*} date
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};
