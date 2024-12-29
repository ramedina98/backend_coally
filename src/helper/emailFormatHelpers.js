/**
 * @module forgotPassword
 *
 * This file has a specific function that helps format the email in a secure style, showing only the
 * first letter and the last two characters before the @ symbol.
 */

function replaceLetters(str) {
    const size = str.length - 3;
    return '*'.repeat(size);
}

export function secureEmailtoShow(email) {
    const [localPart, domainPart] = email.split('@');

    // Verify that the email is valid and that the local part is at least 3 characters long...
    if (!localPart || localPart.length < 3) {
        return 1; // This means that the message has to be different.
    }

    // Get the first character and the 2 last characters...
    const mask = replaceLetters(localPart);
    const formattedLocal = `${localPart[0]}${mask}${localPart.slice(-2)}`;

    // Return the email...
    return `${formattedLocal}@${domainPart}`;
}