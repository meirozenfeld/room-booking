/**
 * Formats a date string to DD-MM-YYYY format
 * @param date - ISO date string
 * @returns Formatted date string (DD-MM-YYYY)
 */
export function formatDate(date: string) {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
}
