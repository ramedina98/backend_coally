/**
 * @class --> Email Handler...
 *
 * This class helps us to manage everything related to sending emails and different types of emails.
 */
import { SERVER } from '../config/config.js';
import logging from '../config/logging.js';
import nodemailer from 'nodemailer';

export default class EmailHandler {
    constructor(email, subject, message) {
        this.email = email;
        this.subject = subject;
        this.message = message;
        this.host_name = SERVER.EHOST;
        this.user = SERVER.EUSER;
        this.pass = SERVER.EPASS;
    }

    // This function creates the transporter...
    transporter() {
        return nodemailer.createTransport({
            host: this.host_name,
            port: 465,
            secure: true,
            auth: {
                user: this.user,
                pass: this.pass
            }
        });
    }

    // This function sends the email...
    async emailSending() {
        try {
            const transporter = this.transporter();

            const response = await transporter.sendMail({
                from: this.user,
                to: this.email,
                subject: this.subject,
                html: this.message
            });

            logging.info(`Email sent successfully: ${response}`);
            return 1;
        } catch (error) {
            logging.error(`Error sending email: ${error.message}`);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}