import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    service: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    budget: {
      type: String,
      trim: true,
      maxlength: 80,
      default: '',
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },
    source: {
      type: String,
      default: 'portfolio',
    },
  },
  {
    timestamps: true,
  },
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
