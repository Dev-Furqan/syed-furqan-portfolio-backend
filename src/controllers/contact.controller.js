import ContactMessage from '../models/ContactMessage.js';
import { sendContactNotification } from '../config/mailer.js';
import validateContact from '../utils/validateContact.js';

export async function createContactMessage(req, res, next) {
  try {
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
