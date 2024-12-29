/**
 * Formats a date into the desired format:
 * - Time: hh:mm:ss AM/PM
 * - Date: dd/mm/yyyy
 *
 * @param {string} isoDate - The ISO date string to format (e.g., "2024-12-29T01:04:48.596Z").
 * @returns {object} An object containing the formatted date and time.
 */
function formatDateTime(isoDate) {
    const date = new Date(isoDate);

    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    // Extract time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    const formattedHours = String(hours).padStart(2, '0');

    // Format the time and date
    const formattedTime = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
    const formattedDate = `${day}/${month}/${year}`;

    return { formattedDate, formattedTime };
}

export default formatDateTime;