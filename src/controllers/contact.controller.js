import mongoose from 'mongoose';
import ContactMessage from '../models/ContactMessage.js';
import { sendContactNotification } from '../config/mailer.js';
import validateContact from '../utils/validateContact.js';

export async function createContactMessage(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      const error = new Error('Database is not connected yet. Please try again shortly.');
      error.statusCode = 503;
      throw error;
    }

    const payload = validateContact(req.body);
    const message = await ContactMessage.create(payload);

    try {
      await sendContactNotification(message);
    } catch (mailError) {
      console.error('Contact email notification failed:', mailError.message);
    }

    res.status(201).json({
      message: 'Contact message received.',
      id: message._id,
    });
  } catch (error) {
    next(error);
  }
}
