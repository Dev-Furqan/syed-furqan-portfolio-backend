const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function validateContact(body) {
  const payload = {
    name: clean(body.name),
    email: clean(body.email).toLowerCase(),
    company: clean(body.company),
    service: clean(body.service),
    budget: clean(body.budget),
    message: clean(body.message),
  };

  if (payload.name.length < 2 || payload.name.length > 80) {
    const error = new Error('Name must be between 2 and 80 characters.');
    error.statusCode = 400;
    throw error;
  }

  if (!emailPattern.test(payload.email) || payload.email.length > 120) {
    const error = new Error('A valid email address is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!payload.service || payload.service.length > 80) {
    const error = new Error('Service is required.');
    error.statusCode = 400;
    throw error;
  }

  if (payload.message.length < 10 || payload.message.length > 3000) {
    const error = new Error('Message must be between 10 and 3000 characters.');
    error.statusCode = 400;
    throw error;
  }

  if (payload.company.length > 120 || payload.budget.length > 80) {
    const error = new Error('One or more optional fields are too long.');
    error.statusCode = 400;
    throw error;
  }

  return payload;
}
